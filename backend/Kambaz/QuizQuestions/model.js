// Kambaz/QuizQuestions/model.js
import mongoose from "mongoose"; 
import schema from "./schema.js"; 

const model = mongoose.model("QuestionBankModel", schema); 
export default model;