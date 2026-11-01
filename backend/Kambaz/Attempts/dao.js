// Kambaz/Attempts/dao.js - Convert to default export
import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AttemptsDao() {
  const createAttempt = (attempt) => {
    const newAttempt = {
      ...attempt,
      _id: uuidv4(),
      startTime: new Date().toISOString(),
      status: "IN_PROGRESS",
      attemptNo: 1  // You might want to calculate this
    };
    return model.create(newAttempt);
  };

  const fetchAttempt = (cid, qid, userId) => {
    return model.find({ course: cid, quiz: qid, user: userId });
  };

  const updateAttempt = (cid, qid, attemptId, attempt) => {
    return model.updateOne({ _id: attemptId }, { $set: attempt });
  };

  const findAttemptsForUser = (userId) => {
    return model.find({ user: userId });
  };

  const findAttemptbyId = (attemptId) => {
    return model.findById(attemptId);
  };

  return {
    createAttempt,
    fetchAttempt, 
    updateAttempt,
    findAttemptsForUser,
    findAttemptbyId
  };
}