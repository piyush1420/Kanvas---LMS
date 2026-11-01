// Kambaz/Modules/routes.js
import ModulesDao from "../Modules/dao.js";
import { requireRole } from "../auth.js";
export default function ModulesRoutes(app) {
  const dao = ModulesDao();
  
  const findModulesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const modules = await dao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const createModuleForCourse = async (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
    };
    const newModule = await dao.createModule(courseId, module);
    res.send(newModule);
  };

  const deleteModule = async (req, res) => {
    const { courseId, moduleId } = req.params;  // Extract both IDs
    const status = await dao.deleteModule(courseId, moduleId);  // Pass both parameters
    res.send(status);
  };

  const updateModule = async (req, res) => {
    const { courseId,moduleId } = req.params;
    const moduleUpdates = req.body;
    const status = await dao.updateModule(courseId, moduleId, moduleUpdates);
    res.send(status);
  };

  const canEdit = requireRole("FACULTY", "ADMIN");
  app.put("/api/courses/:courseId/modules/:moduleId", canEdit, updateModule);
  app.delete("/api/courses/:courseId/modules/:moduleId", canEdit, deleteModule);  // ✅ Updated route pattern
  app.post("/api/courses/:courseId/modules", canEdit, createModuleForCourse);
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
}