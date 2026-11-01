/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa6'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function AssignmentControls() {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const canEdit = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  return (
    <div>
      {canEdit && (
      <Link
        href={`/Courses/${cid}/Assignments/new`}
        className="btn btn-danger btn-lg me-1 float-end"
        id="wd-add-assignment"
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Assignment
      </Link>
       )}
      <Button variant="secondary" size="lg" className="me-2 float-end" id="wd-add-assignment-group">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Group
      </Button>
      
      <Form.Control
        type="text"
        placeholder="Search for Assignments"
        id="wd-search-assignment"
        className="float-start"
        style={{ width: "300px" }}
      />
    </div>
  )
}