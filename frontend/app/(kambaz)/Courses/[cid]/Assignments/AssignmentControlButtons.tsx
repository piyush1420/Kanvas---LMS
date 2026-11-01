/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useSelector } from "react-redux";

export default function AssignmentControlButtons(
  { assignmentId, deleteAssignment, editAssignment }: 
  { assignmentId: string; deleteAssignment: (assignmentId: string) => void; 
  editAssignment: (assignmentId: string) => void }) 

{
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const canEdit = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  return (
    <div className="float-end d-flex align-items-center gap-2">
      {canEdit && (
        <>
      <FaPencil onClick={() => editAssignment(assignmentId)} className="text-primary me-3" />
      <FaTrash className="text-danger me-2 mb-1" onClick={() => deleteAssignment(assignmentId)}/>
      </>)}
      <FaCheckCircle className="text-success" />
      <BsPlus className="fs-4" />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}