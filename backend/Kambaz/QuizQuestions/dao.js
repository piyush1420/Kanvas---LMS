import model from "./model.js";
import { updateQuizPoints } from "../Quizzes/dao.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizQuestionsDao() {
  const fetchQuizQuestions = async (quizId) => {
    const quizQuestions = await model.find({ quiz: quizId });
    return quizQuestions;
  };

  const createQuizQuestion = async (quizQuestion) => {
    const newQuestion = {
      ...quizQuestion,
      _id: uuidv4(),
      isEditing: false,
    };
    const newQuizQuestion = await model.create(newQuestion);
    await updateQuizPoints(quizQuestion.quiz);
    return newQuizQuestion;
  };

  const updateQuizQuestion = async (
    cid,
    quizId,
    questionId,
    updatedQuizQuestion
  ) => {
    const uQuizQuestion = await model.updateOne(
      { _id: questionId, course: cid, quiz: quizId },
      { $set: updatedQuizQuestion }
    );
    await updateQuizPoints(quizId.quiz);
    return uQuizQuestion;
  };

  const deleteQuizQuestion = async (cid, quizId, questionId) => {
    const deletedQuizQuestion = await model.deleteOne({
      _id: questionId,
      quiz: quizId,
      course: cid,
    });
    await updateQuizPoints(quizId);
    return deletedQuizQuestion;
  };

  return {
    fetchQuizQuestions,
    createQuizQuestion,
    updateQuizQuestion,
    deleteQuizQuestion,
  };
}

