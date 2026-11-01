// Kambaz/Attempts/schema.js
import mongoose from "mongoose"; 

const attemptSchema = new mongoose.Schema({ 
   _id: String, 
   user: { type: String, ref: "users" },
   quiz: { type: String, ref: "quizzes" },
   course : { type: String, ref: "courses" },
    answers: [],
    score: Number,
    startTime: String,
    endTime: String,
    grade: String,
    attemptNo: Number,
    status: String,
 }, 
 { collection: "attempts" } 
); 

export default attemptSchema; 