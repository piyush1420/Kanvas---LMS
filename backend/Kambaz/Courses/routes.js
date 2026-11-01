// Kambaz/Courses/routes.js - Updated with Quiz routes
import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";
import QuizzesDao from "../Quizzes/dao.js";
import QuizQuestionsDao from "../QuizQuestions/dao.js";
import AttemptsDao from "../Attempts/dao.js";
import { requireRole } from "../auth.js";

// Students may only change their own enrollments
const canManageEnrollment = (currentUser, uid) =>
  uid === currentUser._id || ["FACULTY", "ADMIN"].includes(currentUser.role);

export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();
  const quizzesDao = QuizzesDao();
  const quizQuestionsDao = QuizQuestionsDao();
  const attemptsDao = AttemptsDao();

  // ========== EXISTING COURSE ROUTES ==========
  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newCourse = await dao.createCourse(req.body);
    await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses);
  };

  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  };

  const findCoursesForEnrolledUsers = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const user = req.session["currentUser"];
      if (!user) {
        res.sendStatus(401);
        return;
      }
      userId = user._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  };

  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      uid = currentUser._id;
    }
    if (!canManageEnrollment(req.session["currentUser"], uid)) {
      res.sendStatus(403);
      return;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };

  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      uid = currentUser._id;
    }
    if (!canManageEnrollment(req.session["currentUser"], uid)) {
      res.sendStatus(403);
      return;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  };

  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  };

  // ========== NEW QUIZ ROUTES ==========

  // Get all quizzes for a course
  const findQuizzesForCourse = async (req, res) => {
    const { cid } = req.params;
    const quizzes = await quizzesDao.findQuizzesForCourse(cid);
    res.json(quizzes);
  };

  // Get quiz details
  const getQuizDetails = async (req, res) => {
    const { cid, qid } = req.params;
    const quizDetails = await quizzesDao.findQuizById(cid, qid);
    if (quizDetails.length === 1) {
      res.json(quizDetails[0]);
    } else {
      res.status(404).send("Quiz not found or duplicate found");
    }
  };

  // Get quiz questions
  const getQuizQuestions = async (req, res) => {
    const { qid } = req.params;
    const questions = await quizQuestionsDao.fetchQuizQuestions(qid);
    res.json(questions);
  };

  // Create new quiz (Faculty only)
  const createQuiz = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.status(403).json({ error: "Only faculty can create quizzes" });
      return;
    }

    const { cid, qid } = req.params;
    const quiz = await quizzesDao.findQuizById(cid, qid);
    if (quiz.length !== 0) {
      res.status(400).send("Quiz already exists");
      return;
    }
    const newQuiz = await quizzesDao.createQuiz(cid, qid, req.body);
    res.json(newQuiz);
  };

  // Update quiz (Faculty only)
  const updateQuiz = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.status(403).json({ error: "Only faculty can update quizzes" });
      return;
    }

    const { cid, qid } = req.params;
    const updatedQuiz = await quizzesDao.updateQuiz(cid, qid, req.body);
    res.json(updatedQuiz);
  };

  // Delete quiz (Faculty only)
  const deleteQuiz = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.status(403).json({ error: "Only faculty can delete quizzes" });
      return;
    }

    const { cid, qid } = req.params;
    const status = await quizzesDao.deleteQuiz(cid, qid);
    res.json(status);
  };

  // Publish/Unpublish quiz (Faculty only)
  const publishQuiz = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.status(403).json({ error: "Only faculty can publish quizzes" });
      return;
    }

    const { cid, qid } = req.params;
    const q = await quizzesDao.publishQuiz(cid, qid);
    res.json(q);
  };

  const unpublishQuiz = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.status(403).json({ error: "Only faculty can unpublish quizzes" });
      return;
    }

    const { cid, qid } = req.params;
    const status = await quizzesDao.unPublishQuiz(cid, qid);
    res.json(status);
  };

  // Quiz Questions Management (Faculty only)
  const createQuizQuestion = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.status(403).json({ error: "Only faculty can create questions" });
      return;
    }

    console.log("question: ", req.body);
    const newQuizQuestion = await quizQuestionsDao.createQuizQuestion(req.body);
    res.json(newQuizQuestion);
  };

  const updateQuizQuestion = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.status(403).json({ error: "Only faculty can update questions" });
      return;
    }

    const { cid, qid, questionId } = req.params;
    const updatedQuizQuestion = await quizQuestionsDao.updateQuizQuestion(
      cid,
      qid,
      questionId,
      req.body
    );
    res.json(updatedQuizQuestion);
  };

  const deleteQuizQuestion = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.status(403).json({ error: "Only faculty can delete questions" });
      return;
    }

    const { cid, qid, questionId } = req.params;
    const status = await quizQuestionsDao.deleteQuizQuestion(
      cid,
      qid,
      questionId
    );
    res.json(status);
  };

  // Quiz Attempts (Students)
  const createAttempt = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    // Add user ID to the attempt
    const attemptData = {
      ...req.body,
      userId: currentUser._id,
    };

    const status = await attemptsDao.createAttempt(attemptData);
    res.json(status);
  };

  const fetchAttempt = async (req, res) => {
    const { cid, qid, userId } = req.params;
    const response = await attemptsDao.fetchAttempt(cid, qid, userId);
    res.json(response);
  };

  const updateAttempt = async (req, res) => {
    const { cid, qid, attemptId } = req.params;
    const status = await attemptsDao.updateAttempt(
      cid,
      qid,
      attemptId,
      req.body
    );
    res.json(status);
  };

  // ========== REGISTER ALL ROUTES ==========

  // Existing course routes
  app.post("/api/users/:uid/courses/:cid", requireRole(), enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", requireRole(), unenrollUserFromCourse);
  app.put("/api/courses/:courseId", requireRole("FACULTY", "ADMIN"), updateCourse);
  app.delete("/api/courses/:courseId", requireRole("FACULTY", "ADMIN"), deleteCourse);
  app.post("/api/users/current/courses", requireRole("FACULTY", "ADMIN"), createCourse);
  app.get("/api/courses", findAllCourses);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUsers);
  app.get("/api/courses/:cid/users", requireRole(), findUsersForCourse);

  // New Quiz routes
  app.get("/api/courses/:cid/quizzes", findQuizzesForCourse);
  app.get("/api/courses/:cid/quiz/:qid/details", getQuizDetails);
  app.get("/api/courses/:cid/quiz/:qid", getQuizQuestions);
  app.post("/api/courses/:cid/quiz/:qid", createQuiz);
  app.put("/api/courses/:cid/quiz/:qid", updateQuiz);
  app.delete("/api/courses/:cid/quiz/:qid", deleteQuiz);
  app.post("/api/courses/:cid/quiz/:qid/publish", publishQuiz);
  app.post("/api/courses/:cid/quiz/:qid/unpublish", unpublishQuiz);

  // Quiz Questions routes
  app.post("/api/courses/:cid/quiz/:qid/questions", createQuizQuestion);
  app.put(
    "/api/courses/:cid/quiz/:qid/questions/:questionId",
    updateQuizQuestion
  );
  app.delete(
    "/api/courses/:cid/quiz/:qid/questions/:questionId",
    deleteQuizQuestion
  );

  // Quiz Attempts routes
  app.post("/api/courses/:cid/quiz/:qid/attempts", createAttempt);
  app.get("/api/courses/:cid/quiz/:qid/attempts/:userId", fetchAttempt);
  app.put("/api/courses/:cid/quiz/:qid/attempts/:attemptId", updateAttempt);
}

