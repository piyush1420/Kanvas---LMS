import { FaPlus } from "react-icons/fa6";
import { IoEllipsisVertical } from "react-icons/io5";

export default function GroupControlButtons() {
    return (
      <div className="float-end d-flex align-items-center gap-2">
        <FaPlus className="fs-4" />
        <IoEllipsisVertical className="fs-4" />
      </div>
    );
  }