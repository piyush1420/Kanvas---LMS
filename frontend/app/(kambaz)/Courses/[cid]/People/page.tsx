// app/(kambaz)/Courses/[cid]/People/page.tsx
"use client"
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "./Table/page";
import * as client from "../../client";

export default function CoursePeople() {
  const { cid } = useParams();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      // This will only get users enrolled in this specific course
      const enrolledUsers = await client.findUsersForCourse(cid as string);
      setUsers(enrolledUsers);
    } catch (error) {
      console.error("Error fetching users for course:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [cid]);

  return (
    <div className="p-4">
      <h3>People</h3>
      {/* No add/filter controls - just show enrolled students */}
      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}