// app/(kambaz)/Courses/[cid]/Assignments/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Link from "next/link";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { IoChevronDown } from "react-icons/io5";
import { FaFileAlt } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { setAssignments } from "./reducer";
import * as client from "../../client";
import AssignmentControlButtons from "./AssignmentControlButtons";
import AssignmentControls from "./AssignmentControls";
import GroupControlButtons from "./GroupControlButtons";

export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const assignments = useSelector((state: any) => state.assignmentsReducer.assignments);
  const courseAssignments = assignments.filter((amt: any) => amt.course === cid);

  const fetchAssignments = async () => {
    try {
      const assignments = await client.findAssignmentsForCourse(cid as string);
      dispatch(setAssignments(assignments));
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [cid]);

  const handleDeleteAssignment = async (assignmentId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this assignment?");
    if (confirmDelete) {
      try {
        await client.deleteAssignment(assignmentId);
        dispatch(setAssignments(assignments.filter((a: any) => a._id !== assignmentId)));
      } catch (error) {
        console.error("Error deleting assignment:", error);
      }
    }
  };

  const handleEditAssignment = (assignmentId: string) => {
    router.push(`/Courses/${cid}/Assignments/${assignmentId}?edit=true`);
  };

  return (
    <div id="wd-assignments">
      <AssignmentControls />
      <br /><br /><br /><br />
      
      <ListGroup className="rounded-0">
        <ListGroupItem className="wd-assignment-group p-0 mb-0 fs-5 border-gray">
          <div className="wd-assignment-header p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <IoChevronDown className="me-2" />
              <span className="fw-bold">ASSIGNMENTS</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="wd-assignment-percentage me-3">40% of Total</span>
              <GroupControlButtons />
            </div>
          </div>
          
          <ListGroup className="rounded-0">
            {courseAssignments.map((crsAmt: any) => (
              <ListGroupItem key={crsAmt._id} className="wd-assignment-item p-3 ps-1 d-flex align-items-start">
                <BsGripVertical className="me-2 fs-3 mt-1" />
                <FaFileAlt className="me-2 mt-1 text-success" />
                <div className="flex-grow-1">
                  <Link href={`/Courses/${crsAmt?.course}/Assignments/${crsAmt?._id}`} className="text-decoration-none">
                    <strong className="text-dark">{crsAmt?._id}</strong>
                  </Link>
                  <div className="text-muted small mt-1">
                    <span className="text-danger">Multiple Modules</span>
                    <span className="mx-1">|</span>
                    {crsAmt?.availableFrom && (
                      <>
                        <span><strong>Not available until</strong> {crsAmt.availableFrom}</span>
                        <span className="mx-1">|</span>
                      </>
                    )}
                    <br />
                    {crsAmt?.dueDate && (
                      <>
                        <span><strong>Due</strong> {crsAmt.dueDate}</span>
                        <span className="mx-1">|</span>
                      </>
                    )}
                    <span>{crsAmt?.points || 100} pts</span>
                  </div>
                </div>
                <AssignmentControlButtons 
                  assignmentId={crsAmt._id}
                  deleteAssignment={handleDeleteAssignment}
                  editAssignment={handleEditAssignment}
                />
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}