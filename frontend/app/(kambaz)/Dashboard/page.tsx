// app/(kambaz)/Dashboard/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "next/navigation";
import { setCourses, addCourse, deleteCourse, updateCourse, enroll, unenroll, setEnrollments } from "../Courses/reducer";
import { v4 as uuidv4 } from 'uuid';

import * as client from "../Courses/client";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
  FormControl,
} from "react-bootstrap";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { courses, enrollments } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [showAll, setShowAll] = useState(false);
  const [course, setCourse] = useState<any>({
    _id: uuidv4(),
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  // Load showAll preference from sessionStorage
  useEffect(() => {
    const savedShowAll = sessionStorage.getItem('showAllCourses');
    if (savedShowAll !== null) {
      setShowAll(JSON.parse(savedShowAll));
    }
  }, []);

  // Save showAll preference to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('showAllCourses', JSON.stringify(showAll));
  }, [showAll]);

  // Fetch courses from server - FIXED to always get ALL courses
  const fetchCourses = async () => {
    try {
      // Always fetch ALL courses - let the UI handle filtering
      const fetchedCourses = await client.fetchAllCourses();
      
      // DEBUG: Log what we got from the server
      console.log("=== FETCHED COURSES FROM SERVER ===");
      console.log("Number of courses:", fetchedCourses.length);
      console.log("First course:", fetchedCourses[0]);
      console.log("All courses:", fetchedCourses);
      
      dispatch(setCourses(fetchedCourses));
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Add new course
  const handleAddCourse = async () => {
    try {
      const newCourse = { 
        ...course, 
        _id: uuidv4(), 
        image: "/images/reactjs.jpg" 
      };
      
      console.log("=== CREATING NEW COURSE ===");
      console.log("Course to create:", newCourse);
      
      const newCourseData = await client.createCourse(newCourse);
      
      console.log("Course created, server returned:", newCourseData);
      
      dispatch(addCourse(newCourseData)); // The server returns the course with its final ID
      dispatch(enroll({ user: currentUser, course: newCourseData }));
      
      // Reset form after successful addition
      setCourse({
        _id: uuidv4(),
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        image: "/images/reactjs.jpg",
        description: "New Description",
      });
      
      // Refresh courses list to ensure sync with server
      await fetchCourses();
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error("Authentication error: Please sign in again");
        redirect("/Account/Signin");
      } else {
        console.error("Error creating course:", error);
        alert("Failed to create course. Please try again.");
      }
    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId: string) => {
    try {
      await client.deleteCourse(courseId);
      dispatch(deleteCourse(courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleEnrollInCourse = async (courseId: string) => {
    try {
      console.log("=== ENROLLING IN COURSE ===");
      console.log("Course ID:", courseId);
      console.log("User ID:", currentUser._id);
      
      await client.enrollInCourse(currentUser._id, courseId);
      dispatch(enroll({ user: currentUser, course: { _id: courseId } }));
      console.log("Successfully enrolled in course:", courseId);
      
      // Refetch to ensure we have latest data
      await fetchCourses();
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };
  
  //handel enrollments
  const handleUnenrollFromCourse = async (courseId: string) => {
    try {
      await client.unenrollFromCourse(currentUser._id, courseId);
      dispatch(unenroll({ user: currentUser, course: { _id: courseId } }));
      console.log("Successfully unenrolled from course:", courseId);
    } catch (error) {
      console.error("Error unenrolling from course:", error);
    }
  };
  
  // Update course
  const handleUpdateCourse = async () => {
    try {
      await client.updateCourse(course);
      dispatch(updateCourse({ course }));
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  // Toggle show all courses
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Fetch courses when component loads or currentUser changes
  useEffect(() => {
    if (currentUser) {
      fetchCourses();
    }
  }, [currentUser]);

  // Also fetch enrollments from database on load
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (currentUser) {
        try {
          const userEnrollments = await client.findEnrollmentsForUser(currentUser._id);
          
          console.log("=== FETCHED ENROLLMENTS ===");
          console.log("User enrollments:", userEnrollments);
          
          // Transform to the format Redux expects
          const enrollmentsForRedux = userEnrollments.map((e: any) => ({
            _id: e._id || `${e.user}-${e.course}`,
            user: e.user,
            course: e.course
          }));
          
          // Use setEnrollments to replace the entire enrollments state
          dispatch(setEnrollments(enrollmentsForRedux));
        } catch (error) {
          console.error("Error fetching enrollments:", error);
        }
      }
    };
    fetchEnrollments();
  }, [currentUser, dispatch]);
  

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      redirect("/Account/Signin");
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const isAdminOrFaculty = currentUser.role === "FACULTY" || currentUser.role === "ADMIN";

  // Filter courses based on enrollment status and showAll toggle
  const filteredCourses = showAll
    ? courses
    : courses.filter((course: any) =>
      enrollments.some(
        (enrollment: any) =>
          enrollment.user === currentUser._id &&
          enrollment.course === course._id
      )
    );
    
  // DEBUG: Log filtered courses
  //80 105 121 117 115 104 32 68 97 103 97

  console.log("=== RENDERING DASHBOARD ===");
  console.log("Show all?", showAll);
  console.log("Current enrollments:", enrollments);
  console.log("All courses in Redux:", courses);
  console.log("Filtered courses to display:", filteredCourses);
  if (filteredCourses.length > 0) {
    console.log("First filtered course full object:", filteredCourses[0]);
    console.log("First course _id:", filteredCourses[0]._id);
    console.log("Type of _id:", typeof filteredCourses[0]._id);
  }

  return (
    <div id="wd-dashboard" className="p-4">
      <h1 id="wd-dashboard-title">
        Dashboard
        {!isAdminOrFaculty && (
          <Button
            className="float-end"
            onClick={toggleShowAll}
          >
            {showAll ? "Enrolled Courses" : "All Courses"}
          </Button>
        )}
      </h1>
      <hr />

      {/* Only show course management for Faculty/Admin */}
      {isAdminOrFaculty && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={handleAddCourse}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={handleUpdateCourse}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            value={course.description}
            as="textarea"
            rows={1}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        Published Courses ({filteredCourses.length})
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {filteredCourses.map((course: any) => {
            // DEBUG: Log each course being rendered
            console.log(`Rendering course card for: ${course.name}, _id: ${course._id}`);
            const courseUrl = `/Courses/${course._id}/Home`;
            console.log(`URL will be: ${courseUrl}`);
            
            return (
            <Col key={course._id} className="wd-dashboard-course" style={{ width: "300px" }}>
              <Card>
                <Link
                  href={courseUrl}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                  onClick={() => {
                    console.log("=== GO BUTTON CLICKED ===");
                    console.log("Navigating to:", courseUrl);
                    console.log("Course object:", course);
                  }}
                >
                  <CardImg
                    src={course.image || "/images/reactjs.jpg"}
                    variant="top"
                    width="100%"
                    height={160}
                  />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title card-title overflow-hidden text-nowrap">
                      {course.name}
                    </CardTitle>
                    <CardText
                      className="wd-dashboard-course-title card-text overflow-y-hidden"
                      style={{ maxHeight: 50 }}
                    >
                      {course.description}
                    </CardText>

                    <div className="d-flex justify-content-between align-items-center">
                      <button className="btn btn-primary wd-go-button">Go</button>

                      {isAdminOrFaculty && (
                        <>
                          <Button
                            onClick={(event) => {
                              event.preventDefault();
                              handleDeleteCourse(course._id);
                            }}
                            className="btn btn-danger wd-card-delete-button float-end"
                            id="wd-delete-course-click"
                          >
                            Delete
                          </Button>
                          <Button
                            id="wd-edit-course-click"
                            onClick={(event) => {
                              event.preventDefault();
                              setCourse(course);
                            }}
                            className="btn btn-warning me-2 wd-card-edit-button float-end"
                          >
                            Edit
                          </Button>
                        </>
                      )}

                      {!isAdminOrFaculty && (
                        enrollments.some((enrollment: any) =>
                          enrollment.user === currentUser._id && enrollment.course === course._id
                        ) ? (
                          <Button
                            className="btn btn-danger wd-card-delete-button"
                            onClick={async (e) => {
                              e.preventDefault();
                              await handleUnenrollFromCourse(course._id);
                            }}
                          >
                            Unenroll
                          </Button>
                        ) : (
                          <Button
                            className="btn btn-success wd-card-delete-button"
                            onClick={async (e) => {
                              e.preventDefault();
                              await handleEnrollInCourse(course._id);
                            }}
                          >
                            Enroll
                          </Button>
                        )
                      )}
                    </div>
                  </CardBody>
                </Link>
              </Card>
            </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}