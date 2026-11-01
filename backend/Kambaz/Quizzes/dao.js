// Kambaz/Quizzes/dao.js - Convert to default export
import model from "./model.js";
import quizQuestionsModel from "../QuizQuestions/model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizzesDao() {
  const findQuizzesForCourse = async (courseId) => {
    const quizzes = await model.find({ course: courseId });
    return quizzes;
  };

  const publishQuiz = async (courseId, quizId) => {
    const quiz = await model.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    await model.updateOne(
      { _id: quizId, course: courseId },
      { $set: { published: true } }
    );
    return await model.findById(quizId);
  };

  const unPublishQuiz = async (courseId, quizId) => {
    const quiz = await model.findById(quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }
    await model.updateOne(
      { _id: quizId, course: courseId },
      { $set: { published: false } }
    );
    return await model.findById(quizId);
  };

  const findQuizById = async (cid, quizId) => {
    const quiz = await model.find({ _id: quizId, course: cid });
    return quiz;
  };

  const createQuiz = async (cid, qid, quiz) => {
    const newQuiz = {
      ...quiz,
      _id: qid || uuidv4(),
      course: cid,
      published: false,
    };
    const created = await model.create(newQuiz);
    return created;
  };

  const updateQuiz = async (cid, quizId, updatedQuiz) => {
    const uQuiz = await model.updateOne(
      { _id: quizId, course: cid },
      { $set: updatedQuiz }
    );
    return uQuiz;
  };

  const deleteQuiz = async (cid, quizId) => {
    const deletedQuiz = await model.deleteOne({ _id: quizId, course: cid });
    return deletedQuiz;
  };

  return {
    findQuizzesForCourse,
    publishQuiz,
    unPublishQuiz,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
  };
}

export async function updateQuizPoints(quizId) {
  await model.updateOne(
    { _id: quizId },
    {
      $set: {
        points: (
          await quizQuestionsModel.find({ quiz: quizId })
        ).reduce((sum, q) => sum + (q.points || 0), 0),
      },
    }
  );
}

