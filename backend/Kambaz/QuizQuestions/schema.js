import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, ref: "QuizModel" },
    question: String,
    type: String,
    course: { type: String, ref: "CourseModel" },
    points: Number,
    isEditing: Boolean,
    options: [],
    correctAnswer: String,
  },
  { collection: "quizQuestions" }
);
export default quizSchema;

