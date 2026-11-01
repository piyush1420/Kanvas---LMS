/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Form, Nav, Tab, Row, Col } from "react-bootstrap";
import * as quizClient from "../client";

export default function QuizDetailsEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState({
    _id: "test",
    course: "default",
    description: "",
    title: "test 1",
    published: true,
    due: "",
    type: "GRADEDQUIZ",
    availableFrom: "",
    until: "",
    points: 0,
    assignmentGroup: "QUIZZES",
    shuffleAns: true,
    timeLmt: 20,
    multipleAttempts: false,
    viewResponses: true,
    showCorrectAnswers: false,
    oneQaTime: true,
    lockdownBrowser: false,
    viewResults: false,
    webcam: false,
    lockQafterA: false,
    accessCode: "",
    maxAttempts: 1,
    for: "Everyone",
  });

  const [questions, setQuestions] = useState([
    {
      _id: "test",
      points: 0,
      text: "test",
      options: [],
      answer: [],
      type: "MULTIPLECHOICE",
    },
  ]);

  const getQuiz = async () => {
    if (qid) {
      try {
        const fetchedQuiz = await quizClient.findQuizById(cid, qid);
        setQuiz({ ...quiz, ...fetchedQuiz });
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    }
  };

  const getQuizQuestions = async () => {
    if (qid) {
      try {
        const questions = await quizClient.getQuestionsForQuiz(cid, qid);
        setQuestions(questions);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    }
  };

  useEffect(() => {
    getQuiz();
    getQuizQuestions();
  }, [qid, cid]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setQuiz({
      ...quiz,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async (cid: any, qid: any) => {
    try {
      await quizClient.updateQuiz(cid, qid, quiz);
      router.back();
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  const publishQuiz = async () => {
    const status = await quizClient.publishQuiz(quiz.course, quiz._id, quiz);
    if (status === 200) {
      setQuiz({ ...quiz, published: true });
    } else {
      console.error("Failed to publish quiz");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const calculateTotalPoints = () => {
    const total = questions.reduce(
      (total, question) => total + (question.points || 0),
      0
    );
    return total;
  };

  return (
    <div className="wd-quiz-editor ms-3 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Form.Check
            type="switch"
            id="published-switch"
            label="Published"
            checked={quiz.published}
            disabled={true}
            onChange={(e) => setQuiz({ ...quiz, published: e.target.checked })}
            className="d-inline-block ms-2"
          />
        </div>
        <div>
          <span>Points {calculateTotalPoints()} </span>
        </div>
      </div>

      <Tab.Container id="quiz-editor-tabs" defaultActiveKey="details">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="details">Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              as={Link}
              href={`/Courses/${cid}/Quizzes/${qid}/questions`}
            >
              Questions
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="details">
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Unnamed Quiz"
                  name="title"
                  value={quiz.title}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quiz Instructions:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={quiz.description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} md={4}>
                  <Form.Label>Quiz Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={quiz.type}
                    onChange={handleChange}
                  >
                    <option value="GRADEDQUIZ">Graded Quiz</option>
                    <option value="PRACTICEQUIZ">Practice Quiz</option>
                    <option value="GRADEDSURVEY">Graded Survey</option>
                    <option value="UNGRADEDSURVEY">Ungraded Survey</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} md={8}>
                  <Form.Label>Assignment Group</Form.Label>
                  <Form.Select
                    name="assignmentGroup"
                    value={quiz.assignmentGroup}
                    onChange={handleChange}
                  >
                    <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                    <option value="QUIZZES">QUIZZES</option>
                    <option value="EXAMS">EXAMS</option>
                    <option value="PROJECTS">PROJECTS</option>
                  </Form.Select>
                </Form.Group>
              </Row>

              <div className="border rounded p-3 mb-3">
                <h5>Options</h5>
                <Form.Group className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id="shuffle-answers"
                    label="Shuffle Answers"
                    name="shuffleAns"
                    checked={quiz.shuffleAns}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2 d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    id="time-limit"
                    label="Time Limit"
                    checked={quiz.timeLmt > 0}
                    onChange={(e) =>
                      setQuiz({ ...quiz, timeLmt: e.target.checked ? 20 : 0 })
                    }
                    className="me-2"
                  />
                  {quiz.timeLmt > 0 && (
                    <>
                      <Form.Control
                        type="number"
                        size="sm"
                        style={{ width: "80px" }}
                        value={quiz.timeLmt}
                        name="timeLmt"
                        onChange={handleChange}
                        min="1"
                      />
                      <span className="ms-2">Minutes</span>
                    </>
                  )}
                </Form.Group>

                <Form.Group className="mb-2 d-flex align-items-center">
                  <Form.Check
                    className="me-2"
                    type="checkbox"
                    id="multiple-attempts"
                    label="Allow Multiple Attempts"
                    name="multipleAttempts"
                    checked={quiz.multipleAttempts}
                    onChange={handleChange}
                  />
                  {quiz.multipleAttempts && (
                    <>
                      <Form.Control
                        type="number"
                        size="sm"
                        style={{ width: "80px" }}
                        value={quiz.maxAttempts}
                        name="maxAttempts"
                        onChange={handleChange}
                        min="1"
                      />
                      <span className="ms-2">Attempts</span>
                    </>
                  )}
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id="showCorrectAnswers"
                    label="Show Correct Answers"
                    name="showCorrectAnswers"
                    checked={quiz.showCorrectAnswers}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id="webcamRequired"
                    label="Webcam Required"
                    name="webcam"
                    checked={quiz.webcam}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id="lockQs"
                    label="Lock Questions after Answering"
                    name="lockQafterA"
                    checked={quiz.lockQafterA}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="border rounded p-3 mb-3">
                <h5>Assign</h5>
                <Row className="mb-3">
                  <Col md={6}>
                    <h6>Available from</h6>
                    <Form.Control
                      type="date"
                      name="availableFrom"
                      value={quiz.availableFrom}
                      onChange={handleChange}
                    />
                  </Col>
                  <Col md={6}>
                    <h6>Until</h6>
                    <Form.Control
                      type="date"
                      name="until"
                      value={quiz.until}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
                <div className="mb-3">
                  <h6>Due</h6>
                  <Form.Control
                    type="date"
                    name="due"
                    value={quiz.due}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end border-top pt-3">
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => handleSave(cid, qid)}>
                  Save
                </Button>
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() => {
                    publishQuiz();
                    handleSave(cid, qid);
                  }}
                >
                  Save and Publish
                </Button>
              </div>
            </Form>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

