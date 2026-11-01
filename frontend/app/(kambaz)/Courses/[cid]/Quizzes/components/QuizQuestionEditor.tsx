/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Nav, Tab, Container, Alert, Form } from "react-bootstrap";
import * as quizClient from "../client";
import QuestionEditor from "../QuestionEditor";
import { v4 as uuidv4 } from "uuid";
import { FaTrash } from "react-icons/fa6";

// Question type definitions
export interface BaseQuestion {
  _id: string;
  quiz: string;
  course: string;
  type: string;
  question: string;
  points: number;
  isEditing: boolean;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "MULTIPLE_CHOICE";
  options: Array<string>;
  correctAnswer: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "TRUE_FALSE";
  correctAnswer: string;
}

export interface FillInBlankQuestion extends BaseQuestion {
  type: "FILL_IN_BLANK";
  correctAnswer: string;
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillInBlankQuestion;

export default function QuizQuestionsEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<{
    type: string;
    message: string;
  } | null>(null);
  const [newQuestionType, setNewQuestionType] =
    useState<string>("MULTIPLE_CHOICE");
  const [questions, setQuestions] = useState<Question[]>([]);

  const getQuiz = async () => {
    if (qid && cid) {
      try {
        const fetchedQuizQuestions = await quizClient.getQuestionsForQuiz(
          cid,
          qid
        );
        const formattedQuestions =
          fetchedQuizQuestions.length > 0
            ? fetchedQuizQuestions.map((q: any) => ({ ...q, isEditing: false }))
            : [];

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setSaveStatus({
          type: "danger",
          message: "Error loading quiz questions.",
        });
      }
    }
  };

  useEffect(() => {
    getQuiz();
  }, [qid, cid]);

  const handleAddQuestion = async () => {
    let newQuestion: Question;

    if (newQuestionType === "MULTIPLE_CHOICE") {
      newQuestion = {
        type: "MULTIPLE_CHOICE",
        question: "New question",
        _id: uuidv4(),
        quiz: qid as string,
        course: cid as string,
        points: 1,
        isEditing: true,
        options: [""],
        correctAnswer: "",
      } as MultipleChoiceQuestion;
    } else if (newQuestionType === "TRUE_FALSE") {
      newQuestion = {
        type: "TRUE_FALSE",
        question: "New question",
        _id: uuidv4(),
        quiz: qid as string,
        course: cid as string,
        points: 1,
        isEditing: true,
        correctAnswer: "False",
      } as TrueFalseQuestion;
    } else {
      newQuestion = {
        type: "FILL_IN_BLANK",
        question: "New question",
        _id: uuidv4(),
        quiz: qid as string,
        course: cid as string,
        points: 1,
        isEditing: true,
        correctAnswer: "",
      } as FillInBlankQuestion;
    }

    const answer = await quizClient.createQuestion(cid, qid, newQuestion);
    newQuestion._id = answer.data._id;
    setQuestions([...questions, newQuestion]);
  };

  const handleSaveQuestion = async (
    questionId: any,
    updatedQuestion: Question
  ) => {
    updatedQuestion.isEditing = false;
    const q = questions.map((q) =>
      q._id === questionId ? updatedQuestion : q
    );
    setQuestions(q);
    await quizClient.updateQuestion(cid, qid, questionId, updatedQuestion);
    setSaveStatus({
      type: "success",
      message: "Question updated successfully!",
    });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleEditQuestion = (questionId: any) => {
    const q = questions.map((q) => {
      if (q._id === questionId) q.isEditing = true;
      return q;
    });
    setQuestions(q);
  };

  const handleCancelEdit = (questionId: any) => {
    const q = questions.map((q) => {
      if (q._id === questionId) q.isEditing = false;
      return q;
    });
    setQuestions(q);
  };

  const handleDeleteQuestion = async (questionId: any) => {
    const q = questions.filter((q) => q._id !== questionId);
    setQuestions(q);
    await quizClient.deleteQuestion(cid, qid, questionId);
    setSaveStatus({
      type: "warning",
      message: "Question deleted.",
    });
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const calculateTotalPoints = () => {
    return questions.reduce((total, question) => total + question.points, 0);
  };

  const handleSave = async () => {
    try {
      if (!cid || !qid) {
        throw new Error("Course ID or Quiz ID is missing");
      }

      const originalQuiz = await quizClient.findQuizById(cid, qid);
      const updatedQuiz = {
        ...originalQuiz,
        points: calculateTotalPoints(),
      };

      await quizClient.updateQuiz(cid, qid, updatedQuiz);

      setSaveStatus({
        type: "success",
        message: "Quiz questions saved successfully!",
      });

      setTimeout(() => {
        router.push(`/Courses/${cid}/Quizzes/${qid}/details`);
      }, 1000);
    } catch (error) {
      console.error("Error saving quiz:", error);
      setSaveStatus({
        type: "danger",
        message: "Error saving quiz questions.",
      });
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes/${qid}/details`);
  };

  return (
    <Container className="wd-quiz-questions-editor py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Quiz Questions</h4>
        <div>
          <span className="fw-bold me-2">Points: {calculateTotalPoints()}</span>
        </div>
      </div>

      {saveStatus && (
        <Alert variant={saveStatus.type} className="my-3">
          {saveStatus.message}
        </Alert>
      )}

      <Tab.Container id="quiz-editor-tabs" defaultActiveKey="questions">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link as={Link} href={`/Courses/${cid}/Quizzes/${qid}/edit`}>
              Details
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="questions">Questions</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="questions">
            <div className="text-center mb-4">
              <div className="d-flex justify-content-center align-items-center">
                <Form.Select
                  value={newQuestionType}
                  onChange={(e) => setNewQuestionType(e.target.value)}
                  className="me-3"
                  style={{ width: "200px" }}
                >
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="TRUE_FALSE">True/False</option>
                  <option value="FILL_IN_BLANK">Fill in the Blank</option>
                </Form.Select>
                <Button
                  variant="outline-secondary"
                  className="px-4 py-2"
                  onClick={handleAddQuestion}
                >
                  + New Question
                </Button>
              </div>
            </div>

            {questions.length === 0 ? (
              <Alert variant="info">
                No questions yet. Click ---New Question--- to add one.
              </Alert>
            ) : (
              <div className="wd-questions-list">
                {questions.map((question, index) => (
                  <div key={question._id} className="mb-4">
                    {question.isEditing ? (
                      <QuestionEditor
                        question={question}
                        onEdit={() => {}}
                        onSave={(updatedQuestion) =>
                          handleSaveQuestion(question._id, updatedQuestion)
                        }
                        onCancel={() => handleCancelEdit(question._id)}
                        onDelete={() => handleDeleteQuestion(question._id)}
                      />
                    ) : (
                      <div className="question-preview border p-3 rounded">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <span className="badge bg-primary me-2">
                              Question {index + 1}
                            </span>
                            <span className="badge bg-secondary">
                              {question.points} pts
                            </span>
                            <span className="ms-2 fw-bold">
                              {question.question}
                            </span>
                          </div>
                          <div className="d-flex align-items-center">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditQuestion(question._id)}
                            >
                              Edit
                            </Button>
                            <FaTrash
                              className="text-danger ms-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleDeleteQuestion(question._id)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="d-flex justify-content-start mt-4">
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleSave}
                disabled={questions.length === 0}
              >
                Save
              </Button>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

