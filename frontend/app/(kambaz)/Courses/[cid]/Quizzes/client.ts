/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const REMOTE_SERVER =
  process.env.NEXT_PUBLIC_HTTP_SERVER || "http://localhost:4000";
const QUIZ_API = `${REMOTE_SERVER}/api`;

const axiosWithCredentials = axios.create({
  withCredentials: true,
});

export const getQuizzesForCourse = async (courseId: any) => {
  const response = await axiosWithCredentials.get(
    `${QUIZ_API}/courses/${courseId}/quizzes`
  );
  return response.data;
};

export const publishQuiz = async (cid: any, quizId: any, quiz: any) => {
  quiz = { ...quiz, published: true };
  const response = await axiosWithCredentials.post(
    `${QUIZ_API}/courses/${cid}/quiz/${quizId}/publish`,
    quiz
  );
  return response.status;
};

export const unpublishQuiz = async (cid: any, quizId: any, quiz: any) => {
  quiz = { ...quiz, published: false };
  const response = await axiosWithCredentials.post(
    `${QUIZ_API}/courses/${cid}/quiz/${quizId}/unpublish`,
    quiz
  );
  return response.status;
};

export const getQuestionsForQuiz = async (cid: any, quizId: any) => {
  const response = await axiosWithCredentials.get(
    `${QUIZ_API}/courses/${cid}/quiz/${quizId}`
  );
  return response.data;
};

export const findQuizById = async (cid: any, quizId: any) => {
  const response = await axiosWithCredentials.get(
    `${QUIZ_API}/courses/${cid}/quiz/${quizId}/details`
  );
  return response.data;
};

export function updateQuiz(cid: any, quizId: any, updatedQuiz: any) {
  const response = axiosWithCredentials.put(
    `${QUIZ_API}/courses/${cid}/quiz/${quizId}`,
    updatedQuiz
  );
  return response;
}

export function createQuiz(cid: any, quizId: any, newQuiz: any) {
  const response = axiosWithCredentials.post(
    `${QUIZ_API}/courses/${cid}/quiz/${quizId}`,
    newQuiz
  );
  return response;
}

export function deleteQuiz(cid: any, quizId: any) {
  const response = axiosWithCredentials.delete(
    `${QUIZ_API}/courses/${cid}/quiz/${quizId}`
  );
  return response;
}

export function createQuestion(cid: any, quizId: any, newQuestion: any) {
  const response = axiosWithCredentials.post(
    `${QUIZ_API}/courses/${cid}/quiz/${quizId}/questions`,
    newQuestion
  );
  return response;
}

export function updateQuestion(
  cid: any,
  quizId: any,
  questionId: any,
  updatedQuestion: any
) {
  const response = axiosWithCredentials.put(
    `${QUIZ_API}/courses/${cid}/quiz/${quizId}/questions/${questionId}`,
    updatedQuestion
  );
  return response;
}

export function deleteQuestion(cid: any, quizId: any, questionId: any) {
  const response = axiosWithCredentials.delete(
    `${QUIZ_API}/courses/${cid}/quiz/${quizId}/questions/${questionId}`
  );
  return response;
}

export const findQuizAttemptById = async (
  cid: any,
  quizId: any,
  userId: any
) => {
  const attempt = await axiosWithCredentials.get(
    `${QUIZ_API}/courses/${cid}/quiz/${quizId}/attempts/${userId}`
  );
  return attempt.data;
};

export const createAttempt = async (cid: any, quizId: any, attempt: any) => {
  const response = await axiosWithCredentials.post(
    `${QUIZ_API}/courses/${cid}/quiz/${quizId}/attempts`,
    attempt
  );
  return response.data;
};

export const updateAttempt = async (
  cid: any,
  quizId: any,
  attemptId: any,
  attempt: any
) => {
  const response = await axiosWithCredentials.put(
    `${QUIZ_API}/courses/${cid}/quiz/${quizId}/attempts/${attemptId}`,
    attempt
  );
  return response.data;
};

