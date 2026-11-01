/* eslint-disable @next/next/no-assign-module-variable */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
// app/(kambaz)/Courses/[cid]/Modules/page.tsx
"use client"
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import * as client from "../../client";

// redux imports
import { useSelector, useDispatch } from "react-redux";
import {
  setModules,
  addModule as addModuleAction,
  deleteModule as deleteModuleAction,
  editModule as editModuleAction,
  updateModule as updateModuleAction,
} from "./reducer";

export default function Modules() {
  const { cid } = useParams();

  // moduleName remains local for the ModuleEditor form
  const [moduleName, setModuleName] = useState("");

  // retrieve modules from redux store instead of local state
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();

  // Fetch modules from server
  const fetchModules = async () => {
    const modules = await client.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Create module on server and update Redux store
  const onCreateModuleForCourse = async () => {
    if (!cid) return;
    try {
      const newModule = { name: moduleName, course: cid };
      const module = await client.createModuleForCourse(cid as string, newModule);
      dispatch(setModules([...modules, module]));
      setModuleName(""); // Clear the input field after successful creation
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };

  // Delete module on server and update Redux store
  const onRemoveModule = async (moduleId: string) => {
    try {
      await client.deleteModule(cid as string, moduleId);
      dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  // Update module on server and update Redux store
  const onUpdateModule = async (module: any) => {
    try {
      const updatedModule = await client.updateModule(cid as string, module);
      dispatch(setModules(modules.map((m: any) => 
        m._id === module._id ? updatedModule : m
      )));
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  // remove local delete/edit/update mutators — use dispatch directly below
  return (
    <div>
      <ModulesControls 
        setModuleName={setModuleName} 
        moduleName={moduleName} 
        addModule={onCreateModuleForCourse} 
      />
      <br /><br /><br /><br />
      
      <ListGroup id="wd-modules" className="rounded-0">
        {modules
          .map((module: any) => (
            // eslint-disable-next-line react/jsx-key
            <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" /> {!module.editing && module.name}
      { module.editing && (
        <FormControl className="w-50 d-inline-block"
               onChange={(e) => dispatch(updateModuleAction({ ...module, name: e.target.value }))}
               onKeyDown={(e) => {
                 if (e.key === "Enter") {
                   onUpdateModule({ ...module, editing: false });
                 }
               }}
               defaultValue={module.name}/>
      )} <ModuleControlButtons moduleId={module._id}
        deleteModule={(moduleId: string) => onRemoveModule(moduleId)}
        editModule={(moduleId: string) => dispatch(editModuleAction(moduleId))}/>
              </div>
              {module.lessons && (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson: any) => (
                    <ListGroupItem className="wd-lesson p-3 ps-1">
                      <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons />
                      
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          ))}
      </ListGroup>
    </div>
  );
}