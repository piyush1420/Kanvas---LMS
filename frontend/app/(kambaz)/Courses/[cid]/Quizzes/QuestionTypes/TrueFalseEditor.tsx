import React from "react";
import { Form, Button } from "react-bootstrap";
import { TrueFalseQuestion } from "../components/QuizQuestionEditor";

interface TrueFalseEditorProps {
  question: TrueFalseQuestion;
  onChange: (question: TrueFalseQuestion) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function TrueFalseEditor({ question, onChange, onCancel, onSave }: TrueFalseEditorProps) {
  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...question,
      question: e.target.value
    });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value, 10) || 0;
    onChange({
      ...question,
      points: points
    });
  };

  const handleCorrectAnswerChange = (value: string) => {
    onChange({
      ...question,
      correctAnswer: value
    });
  };

  return (
    <div className="p-3">
      <div className="mb-3">
        <p className="instruction-text">
          <strong>Enter your question text, then select if True or False is the correct answer.</strong>
        </p>
      </div>
      
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Question:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={question.question}
            onChange={handleQuestionTextChange}
            placeholder="Is it true that 2 + 2 = 4?"
          />
        </Form.Group>

        <div className="d-flex justify-content-end mb-3">
          <Form.Group className="d-flex align-items-center">
            <Form.Label className="me-2">pts:</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="1"
              value={question.points}
              onChange={handlePointsChange}
              style={{ width: "60px" }}
            />
          </Form.Group>
        </div>

        <Form.Group className="mb-3">
          <Form.Label><strong>Correct Answer:</strong></Form.Label>
          <div className="d-flex align-items-center mb-2">
            <div className="d-flex align-items-center me-4">
              <Form.Check
                type="radio"
                id="true-answer"
                label="True"
                name="trueFalseAnswer"
                checked={question.correctAnswer === "True"}
                onChange={() => handleCorrectAnswerChange("True")}
                className={question.correctAnswer === "True" ? "fw-bold" : ""}
              />
            </div>
            <div className="d-flex align-items-center">
              <Form.Check
                type="radio"
                id="false-answer"
                label="False"
                name="trueFalseAnswer"
                checked={question.correctAnswer === "False"}
                onChange={() => handleCorrectAnswerChange("False")}
                className={question.correctAnswer === "False" ? "fw-bold" : ""}
              />
            </div>
          </div>
        </Form.Group>

        <div className="d-flex justify-content-start mt-4">
          <Button variant="outline-secondary" className="me-2" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onSave}>
            Update Question
          </Button>
        </div>
      </Form>
    </div>
  );
}