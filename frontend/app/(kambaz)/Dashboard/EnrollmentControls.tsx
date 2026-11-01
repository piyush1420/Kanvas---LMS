// app/(kambaz)/Dashboard/EnrollmentControls.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function EnrollmentControls({ 
  courseId, 
  showAllCourses,
  onEnroll,
  onUnenroll
}: { 
  courseId: string; 
  showAllCourses: boolean;
  onEnroll: (courseId: string) => void;
  onUnenroll: (courseId: string) => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

  if (!currentUser || currentUser.role === "FACULTY") {
    return null; // Faculty don't need enrollment buttons
  }

  const isEnrolled = enrollments.some(
    (e: any) => e.user === currentUser._id && e.course === courseId
  );

  const handleEnrollment = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isEnrolled) {
      await onUnenroll(courseId);
    } else {
      await onEnroll(courseId);
    }
  };

  // Only show enrollment controls when viewing all courses
  if (!showAllCourses) {
    return null;
  }

  return (
    <Button
      variant={isEnrolled ? "danger" : "success"}
      size="sm"
      className="mt-2"
      onClick={handleEnrollment}
    >
      {isEnrolled ? "Unenroll" : "Enroll"}
    </Button>
  );
}