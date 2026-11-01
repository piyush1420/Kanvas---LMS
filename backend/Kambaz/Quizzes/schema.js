import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, ref: "CourseModel" },
    description: String,
    title: String,
    published: Boolean,
    due: String,
    type: String,
    availableFrom: String,
    until: String,
    points: Number,
    assignmentGroup: String,
    shuffleAns: Boolean,
    timeLmt: Number,
    multipleAttempts: Boolean,
    viewResponses: Boolean,
    showCorrectAnswers: Boolean,
    oneQaTime: Boolean,
    lockdownBrowser: Boolean,
    viewResults: Boolean,
    webcam: Boolean,
    lockQafterA: Boolean,
    accessCode: String,
    maxAttempts: Number,
  },
  { collection: "quizzes" }
);
export default quizSchema;

