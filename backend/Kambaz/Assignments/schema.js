// Kambaz/Assignments/schema.js
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, default: "New Assignment" },
    course: { type: String, required: true },
    description: { type: String, default: "" },
    points: { type: Number, default: 100 },
    group: {
      type: String,
      default: "ASSIGNMENTS"
    },
    displayGradeAs: {
      type: String,
      default: "Percentage"
    },
    submissionType: {
      type: String,
      default: "Online"
    },
    assignTo: {
      type: String,
      default: "Everyone"
    },
    dueDate: { type: String, default: "" },
    availableFrom: { type: String, default: "" },
    availableUntil: { type: String, default: "" },
    editorDueDate: { type: String, default: "" },
    editorAvailableFrom: { type: String, default: "" },
    editorAvailableUntil: { type: String, default: "" }
  },
  { collection: "assignments", strict: false }
);

export default assignmentSchema;