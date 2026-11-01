// Kambaz/Assignments/routes.js - Piyush Daga
import AssignmentsDao from "./dao.js";
import { requireRole } from "../auth.js";

export default function AssignmentsRoutes(app) {
  const dao = AssignmentsDao();
  
  const findAssignmentsForCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
      const assignments = await dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (error) {
      console.error("Error finding assignments:", error);
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  };

  const createAssignmentForCourse = async (req, res) => {
    const { courseId } = req.params;
    const assignment = {
      ...req.body,
      course: courseId,
    };
    try {
      const newAssignment = await dao.createAssignment(assignment);
      res.json(newAssignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ error: "Failed to create assignment" });
    }
  };

  const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    try {
      const status = await dao.deleteAssignment(assignmentId);
      res.json(status);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      res.status(500).json({ error: "Failed to delete assignment" });
    }
  };

  const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    try {
      const status = await dao.updateAssignment(assignmentId, assignmentUpdates);
      res.json(status);
    } catch (error) {
      console.error("Error updating assignment:", error);
      res.status(500).json({ error: "Failed to update assignment" });
    }
  };

  const canEdit = requireRole("FACULTY", "ADMIN");
  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", canEdit, createAssignmentForCourse);
  app.delete("/api/assignments/:assignmentId", canEdit, deleteAssignment);
  app.put("/api/assignments/:assignmentId", canEdit, updateAssignment);
}