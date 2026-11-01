// app/(kambaz)/Courses/[cid]/People/Table/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "../Details";

export default function PeopleTable({ 
  users = [], 
  fetchUsers 
}: { 
  users?: any[]; 
  fetchUsers: () => void; 
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showUserId, setShowUserId] = useState<string | null>(null);
  
  // Get current user to check role
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <div id="wd-people-table">
      {/* Only show PeopleDetails modal for admins */}
      {showDetails && isAdmin && (
        <PeopleDetails
          uid={showUserId}
          onClose={() => {
            setShowDetails(false);
            fetchUsers();
          }}
        />
      )}
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login ID</th>
            <th>Section</th>
            <th>Role</th>
            <th>Last Activity</th>
            <th>Total Activity</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user && user._id)
            .map((user: any) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <span 
                    className={isAdmin ? "text-decoration-underline" : "text-decoration-none"}
                    onClick={() => {
                      // Only allow clicking if admin
                      if (isAdmin) {
                        setShowDetails(true);
                        setShowUserId(user._id);
                      }
                    }}
                    style={{ cursor: isAdmin ? 'pointer' : 'default' }}
                  >
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">{user?.firstName || 'Unknown'} </span>
                    <span className="wd-last-name">{user?.lastName || 'User'}</span>
                  </span>
                </td>
                <td className="wd-login-id">{user?.loginId || 'N/A'}</td>
                <td className="wd-section">{user?.section || 'N/A'}</td>
                <td className="wd-role">{user?.role || 'N/A'}</td>
                <td className="wd-last-activity">{user?.lastActivity || 'N/A'}</td>
                <td className="wd-total-activity">{user?.totalActivity || 'N/A'}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}