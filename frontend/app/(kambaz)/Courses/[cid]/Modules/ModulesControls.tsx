/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import BanCheckmark from "./BanCheckmark";

import ModuleEditor from "./ModuleEditor";//for module editor dialog
import { useState } from "react";
import { useSelector } from "react-redux";

export default function ModulesControls(
  { moduleName, setModuleName, addModule }:
  { moduleName: string; setModuleName: (title: string) => void; addModule: () => void; }) {
   const [show, setShow] = useState(false);
   const handleClose = () => setShow(false);
   const handleShow = () => setShow(true);

    // Get current user from Redux
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  // Only Faculty/Admin can add modules
  const canAddModule =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
 return (
   <div id="wd-modules-controls" className="text-nowrap">
     {canAddModule && (
        <Button
          variant="danger"
          onClick={handleShow}
          size="lg"
          className="me-1 float-end"
          id="wd-add-module-btn"
        >
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Module
        </Button>
      )}

     <Dropdown className="float-end me-2">
       <DropdownToggle variant="secondary" size="lg" id="wd-publish-all-btn">
         <GreenCheckmark /> Publish All
       </DropdownToggle>
       <DropdownMenu>
         <DropdownItem id="wd-publish-all">
           <GreenCheckmark /> Publish All
         </DropdownItem>
         <DropdownItem id="wd-publish-all-modules-and-items">
           <GreenCheckmark /> Publish all modules and items
         </DropdownItem>
         <DropdownItem id="wd-publish-modules-only">
           <GreenCheckmark /> Publish modules only
         </DropdownItem>
         {/* Create two more items with IDs wd-unpublish-all-modules-and-items and wd-unpublish-modules-only with
             labels Unpublish all modules and items and Unpublish modules only */}
        <DropdownItem id="wd-unpublish-all-modules-and-items">
                        <BanCheckmark /> Unpublish all modules and items
                    </DropdownItem>
                    <DropdownItem id="wd-unpublish-modules-only">
                        <BanCheckmark /> Unpublish modules only
                    </DropdownItem>

       </DropdownMenu>
     </Dropdown>
     {/* Implement the View Progress and Collapse All buttons with IDs wd-view-progress and wd-collapse-all */}

     <Button variant="secondary" size="lg" className="me-2 float-end" id="wd-view-progress">
                View Progress
            </Button>
            <Button variant="secondary" size="lg" className="me-2 float-end" id="wd-collapse-all">
                Collapse All
            </Button>
      <ModuleEditor  show={show} handleClose={handleClose} dialogTitle="Add Module"
       moduleName={moduleName} setModuleName={setModuleName} addModule={addModule} />

   </div>
);}
