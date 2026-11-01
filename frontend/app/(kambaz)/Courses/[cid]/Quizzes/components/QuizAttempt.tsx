/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  Card,
  Button,
  Form,
  Alert,
  Container,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import * as quizClient from "../client";
import { FaArrowLeft } from "react-icons/fa";

interface QuizQuestion {
  _id: string;
  quiz: string;
  question: string;
  type: string;
  options?: Array<{ text: string } | string>;
  correctAnswer?: string | boolean;
  points: number;
}

interface Quiz {
  _id: string;
  title: string;
  course: string;
  published: boolean;
  oneQaTime: boolean;
  multipleAttempts: boolean;
  maxAttempts: number;
  shuffleAns: boolean;
  points: number;
  timeLmt: number;
  showCorrectAnswers: boolean;
}

interface UserAnswers {
  [key: string]: string | boolean;
}

export default function QuizAttempt() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { cid, qid, attemptId } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [attempt, setAttempt] = useState<any>({
    _id: attemptId,
    attemptNo: 0,
    completed: false,
    score: 0,
    percentage: 0,
    letterGrade: "",
    answers: [],
    quiz: qid,
    course: cid,
    student: currentUser._id,
  });
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ [key: string]: string }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [creatingAttempt, setCreatingAttempt] = useState(false);

  useEffect(() => {
    if (currentUser?.role !== "STUDENT") {
      router.push(`/Courses/${cid}/Quizzes/${qid}/details`);
    }
  }, [currentUser, cid, qid, router]);

  useEffect(() => {
    if (quiz?.timeLmt && quiz.timeLmt > 0 && !submitted) {
      const timerMinutes = quiz.timeLmt;
      setTimeLeft(timerMinutes * 60);

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === null || prevTime <= 0) {
            clearInterval(timer);
            if (!submitted && attempt) {
              handleSubmitQuiz();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, attempt, submitted]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!cid || !qid) {
          setError("Missing course or quiz ID");
          setLoading(false);
          return;
        }

        const quizDetails = await quizClient.findQuizById(cid, qid);
        setQuiz(quizDetails);

        if (!quizDetails.published) {
          setError("This quiz is not available for attempt.");
          setLoading(false);
          return;
        }

        function shuffleArray(array: any[]) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        }

        const quizQuestions = await quizClient.getQuestionsForQuiz(cid, qid);
        if (quizDetails.shuffleAns) {
          setQuestions(shuffleArray(quizQuestions));
        } else {
          setQuestions(quizQuestions);
        }

        try {
          setCreatingAttempt(true);
          const attempts = await quizClient.findQuizAttemptById(
            cid,
            qid,
            currentUser._id
          );
          const newAttempt = attempts[0];
          setAttempt({ ...newAttempt, attemptNo: newAttempt.attemptNo + 1 });
          setCreatingAttempt(false);

          const initialAnswers: UserAnswers = {};
          quizQuestions.forEach((q: QuizQuestion) => {
            initialAnswers[q._id] = "";
          });
          setUserAnswers(initialAnswers);
        } catch (err) {
          console.error("Error creating attempt:", err);
          setError("Failed to create quiz attempt. Please try again.");
          setCreatingAttempt(false);
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching quiz data:", err);
        setError(err.message || "An error occurred while loading the quiz.");
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [cid, qid]);

  const handleAnswerChange = async (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!attempt || !cid || !qid) return;

    try {
      const questionResults: { [key: string]: string } = {};

      questions.forEach((question) => {
        let cAns;
        let userAnswer;
        if (question.type === "FILL_IN_BLANK") {
          cAns = (question.correctAnswer as string).trim().toLowerCase();
          userAnswer = (userAnswers[question._id] as string)
            .trim()
            .toLowerCase();
        } else {
          cAns = question.correctAnswer;
          userAnswer = userAnswers[question._id];
        }
        if (cAns === userAnswer) {
          questionResults[question._id] = "correct";
        } else {
          questionResults[question._id] = "incorrect";
        }
      });

      setResults(questionResults);

      const questionsValidated = {
        answers: questions.map((question) => {
          return {
            questionId: question._id,
            answer: userAnswers[question._id],
            result: questionResults[question._id],
            points:
              questionResults[question._id] === "correct" ? question.points : 0,
          };
        }),
      };

      const totalPointsScored = questions
        .filter((q) => questionResults[q._id] === "correct")
        .reduce((acc, q) => acc + q.points, 0);

      const q = {
        ...attempt,
        answers: questionsValidated.answers,
        completed: true,
        score: totalPointsScored,
        percentage:
          (totalPointsScored /
            questions.reduce((acc, q) => acc + q.points, 0)) *
          100,
      };

      setAttempt(q);
      await quizClient.updateAttempt(cid, qid, attemptId, q);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting quiz:", err);
      setError(err.message || "An error occurred while submitting the quiz.");
    }
  };

  const getFormattedOptions = (question: QuizQuestion) => {
    if (!question.options) return [];

    return question.options.map((option) => {
      if (typeof option === "string") {
        return { text: option };
      }
      return option;
    });
  };

  if (loading || creatingAttempt) {
    return (
      <Container className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading quiz...</span>
        </Spinner>
        <p className="mt-3">Please wait while we prepare your quiz...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Link href={`/Courses/${cid}/Quizzes`}>
          <Button variant="secondary">Back to Quizzes</Button>
        </Link>
      </Container>
    );
  }

  if (!quiz || !attempt) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Quiz not found or not available</Alert>
        <Link href={`/Courses/${cid}/Quizzes`}>
          <Button variant="secondary">Back to Quizzes</Button>
        </Link>
      </Container>
    );
  }

  if (submitted && attempt.completed) {
    return (
      <Container className="mt-4">
        <div className="mb-3">
          <Link href={`/Courses/${cid}/Quizzes`}>
            <Button variant="outline-secondary" size="sm">
              <FaArrowLeft className="me-1" /> Back to Quizzes
            </Button>
          </Link>
        </div>

        <Card>
          <Card.Header className="bg-light">
            <h3>{quiz.title} - Results</h3>
            <div className="text-muted">Attempt #{attempt.attemptNo}</div>
          </Card.Header>

          <Card.Body>
            <Alert
              variant={
                attempt.percentage && attempt.percentage >= 70
                  ? "success"
                  : "danger"
              }
            >
              <h4>
                Your Score: {attempt.score}/{quiz.points} (
                {Math.round(attempt.percentage || 0)}%)
              </h4>
            </Alert>

            <div className="mb-4">
              {quiz.showCorrectAnswers ? (
                <h5 className="mt-4">Question Results:</h5>
              ) : (
                <h5>Showing Correct Answers is disabled</h5>
              )}
              {quiz.showCorrectAnswers &&
                questions.map((question, index) => {
                  const userAnswer = userAnswers[question._id];
                  const isCorrect = results[question._id] === "correct";

                  return (
                    <Card key={question._id} className="mb-2">
                      <Card.Header
                        className={
                          isCorrect
                            ? "bg-success text-white"
                            : "bg-danger text-white"
                        }
                      >
                        <span>
                          Question {index + 1}:{" "}
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                        <span className="float-end">
                          Points{" "}
                          {isCorrect
                            ? `${question.points}/${question.points}`
                            : `0/${question.points}`}
                        </span>
                      </Card.Header>
                      <Card.Body>
                        <p>
                          <strong>Question:</strong> {question.question}
                        </p>
                        <hr />
                        <p>
                          <strong>Your answer:</strong> {String(userAnswer)}
                        </p>
                        <p>
                          <strong>Correct answer:</strong>{" "}
                          {String(question.correctAnswer)}
                        </p>
                      </Card.Body>
                    </Card>
                  );
                })}
            </div>

            <Link href={`/Courses/${cid}/Quizzes`}>
              <Button variant="secondary">Back to Quizzes</Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (quiz.oneQaTime) {
    const currentQ = questions[currentQuestion] || null;

    if (!currentQ) {
      return (
        <Container className="mt-4">
          <Alert variant="danger">No questions found for this quiz</Alert>
          <Link href={`/Courses/${cid}/Quizzes`}>
            <Button variant="secondary">Back to Quizzes</Button>
          </Link>
        </Container>
      );
    }

    const formattedOptions = getFormattedOptions(currentQ);

    return (
      <Container className="mt-4">
        <div className="mb-3">
          <Link href={`/Courses/${cid}/Quizzes`}>
            <Button variant="outline-secondary" size="sm">
              <FaArrowLeft className="me-1" /> Back to Quizzes
            </Button>
          </Link>
        </div>

        <Card>
          <Card.Header className="bg-light d-flex justify-content-between align-items-center">
            <div>
              <h3>{quiz.title}</h3>
              <div className="text-muted">Attempt #{attempt.attemptNo}</div>
            </div>
            {quiz.timeLmt > 0 && (
              <div className="timer-display">
                <h4>Time Left: {formatTime(timeLeft)}</h4>
              </div>
            )}
          </Card.Header>

          <Card.Body>
            <div className="mb-3">
              <ProgressBar
                now={((currentQuestion + 1) / questions.length) * 100}
                label={`${currentQuestion + 1}/${questions.length}`}
                variant="primary"
              />
            </div>

            <Card className="mb-4">
              <Card.Header>
                Question {currentQuestion + 1}{" "}
                <span className="float-end">{currentQ.points} pt</span>
              </Card.Header>
              <Card.Body>
                <p>{currentQ.question}</p>

                {currentQ.type === "TRUE_FALSE" ? (
                  <Form>
                    <Form.Check
                      type="radio"
                      id="true-answer"
                      label="True"
                      checked={userAnswers[currentQ._id] === "True"}
                      onChange={() => handleAnswerChange(currentQ._id, "True")}
                      className="mb-2"
                    />
                    <Form.Check
                      type="radio"
                      id="false-answer"
                      label="False"
                      checked={userAnswers[currentQ._id] === "False"}
                      onChange={() => handleAnswerChange(currentQ._id, "False")}
                    />
                  </Form>
                ) : currentQ.type === "MULTIPLE_CHOICE" ? (
                  <Form>
                    {formattedOptions.map((option, optIndex) => (
                      <Form.Check
                        key={optIndex}
                        type="radio"
                        id={`option-${optIndex}`}
                        label={option.text}
                        checked={userAnswers[currentQ._id] === option.text}
                        onChange={() =>
                          handleAnswerChange(currentQ._id, option.text)
                        }
                        className="mb-2"
                      />
                    ))}
                  </Form>
                ) : (
                  <Form.Control
                    type="text"
                    placeholder="Type your answer here"
                    value={(userAnswers[currentQ._id] as string) || ""}
                    onChange={(e) =>
                      handleAnswerChange(currentQ._id, e.target.value)
                    }
                  />
                )}
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-between">
              <Button
                variant="outline-secondary"
                onClick={goToPrevQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              {currentQuestion < questions.length - 1 ? (
                <Button variant="outline-primary" onClick={goToNextQuestion}>
                  Next
                </Button>
              ) : (
                <Button variant="danger" onClick={handleSubmitQuiz}>
                  Submit Quiz
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return null;
}
