import React from "react";
import { MdDoNotDisturbAlt, MdAnnouncement, MdNotificationsNone }
  from "react-icons/md";
import { FaCheckCircle, FaHome } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { IoNewspaperOutline } from "react-icons/io5";
import { BsGraphUp } from "react-icons/bs";
import { Button } from "react-bootstrap";

export default function CourseStatus() {
  return (
    <div id="wd-course-status" style={{ width: "350px" }}>
      <h2>Course Status</h2>

      <div className="d-flex mb-2">
        <div className="w-50 pe-1">
          <div className="mb-1">
            <Button
              variant="secondary"
              size="lg"
              className="w-100 text-nowrap"
            >
              <MdDoNotDisturbAlt className="me-2 fs-5" />
              Unpublish
            </Button>
          </div>
        </div>

        <div className="w-50">
          <div className="mb-1">
            <Button variant="success" size="lg" className="w-100">
              <FaCheckCircle className="me-2 fs-5" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-1">
        <Button
          variant="secondary"
          size="lg"
          className="w-100 text-start"
        >
          <BiImport className="me-2 fs-5" />
          Import Existing Content
        </Button>
      </div>

      <div className="mb-1">
        <Button
          variant="secondary"
          size="lg"
          className="w-100 text-start"
        >
          <LiaFileImportSolid className="me-2 fs-5" />
          Import from Commons
        </Button>
      </div>

      <div className="mb-1">
        <Button
          variant="secondary"
          size="lg"
          className="w-100 text-start"
        >
          <FaHome className="me-2 fs-5" />
          Choose Home Page
        </Button>
      </div>

      <div className="mb-1">
        <Button
          variant="secondary"
          size="lg"
          className="w-100 text-start"
        >
          <IoNewspaperOutline className="me-2 fs-5" />
          View Course Stream
        </Button>
      </div>

      <div className="mb-1">
        <Button
          variant="warning"
          size="lg"
          className="w-100 text-start"
        >
          <MdAnnouncement className="me-2 fs-5" />
          New Announcement
        </Button>
      </div>

      <div className="mb-1">
        <Button
          variant="info"
          size="lg"
          className="w-100 text-start"
        >
          <BsGraphUp className="me-2 fs-5" />
          New Analytics
        </Button>
      </div>

      <div className="mb-1">
        <Button
          variant="secondary"
          size="lg"
          className="w-100 text-start"
        >
          <MdNotificationsNone className="me-2 fs-5" />
          View Course Notifications
        </Button>
      </div>
    </div>
  );
}
