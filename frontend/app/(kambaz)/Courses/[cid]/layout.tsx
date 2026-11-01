/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ReactNode, useState, useEffect } from "react";
import CourseNavigation from "./navigation";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.coursesReducer);
  
  const course = courses.find((course: any) => course._id === cid);
  const [showNav, setShowNav] = useState(false);

  // Check authentication
  if (!currentUser) {
    redirect("/Account/Signin");
  }

  // Check authorization for students
  if (currentUser.role === "STUDENT") {
    const isEnrolled = enrollments.some(
      (e: any) => e.user === currentUser._id && e.course === cid
    );
    
    if (!isEnrolled) {
      redirect("/Dashboard");
    }
  }
  
  // Faculty and Admin have access to all courses, so no check needed

  return (
    <div id="wd-courses">
      <h2>
        <FaAlignJustify
          className="me-4 fs-4 mb-1"
          onClick={() => setShowNav(!showNav)}
        />
        {course?.name}
      </h2>
      <hr />
      <div className="d-flex">
        <div className={showNav ? "d-block d-md-block" : "d-none d-md-block"}>
          <CourseNavigation />
        </div>
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}