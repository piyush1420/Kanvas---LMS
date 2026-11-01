// Kambaz/Attempts/model.js
import mongoose from "mongoose"; 
import schema from "./schema.js"; 

const model = mongoose.model("AttemptModel", schema); 
export default model; 