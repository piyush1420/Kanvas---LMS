// Kambaz/Courses/dao.js
import model from "./model.js";
import EnrollmentModel from "../Enrollments/model.js";  // Add this import

export default function CoursesDao() {  // Remove db parameter
  
  async function findAllCourses() {  // Add async
    return await model.find({});  // Returns EVERYTHING including _id
  }

  async function findCoursesForEnrolledUsers(userId) {
    // Find all enrollments for this user
    const enrollments = await EnrollmentModel.find({ user: userId });
    
    // Extract course IDs
    const courseIds = enrollments.map(enrollment => enrollment.course);
    
    // Find courses with projection - only get name and description
    const courses = await model.find(
      { _id: { $in: courseIds } }
      // { name: 1, description: 1 }
    );
    
    return courses;
  }
  // Create a new course
  async function createCourse(course) {  // Add async
    // Don't add _id manually - MongoDB does this automatically
    return await model.create(course);
  }
  
  // Delete a course and all associated enrollments
  async function deleteCourse(courseId) {  // Add async
    // Delete the course
    const result = await model.deleteOne({ _id: courseId });
    
    // Also delete all enrollments for this course
    await EnrollmentModel.deleteMany({ course: courseId });
    
    return result;
  }

  // Update a course
  async function updateCourse(courseId, courseUpdates) {  // Add async
    return await model.updateOne({ _id: courseId }, { $set: courseUpdates });
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUsers,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}