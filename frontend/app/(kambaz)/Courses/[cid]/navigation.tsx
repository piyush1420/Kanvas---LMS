// app/(kambaz)/Courses/[cid]/Navigation.tsx
"use client"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ListGroupItem } from "react-bootstrap";
import { courses } from "../../Database";

export default function CourseNavigation() {
  const pathname = usePathname();
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
  
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <ListGroupItem 
          key={link} 
          as={Link} 
          href={`/Courses/${course?._id}/${link}`}  // Just use link name directly
          className="list-group-item text-danger border-0"
        >
          {link}
        </ListGroupItem>
      ))}
    </div>
  );
}