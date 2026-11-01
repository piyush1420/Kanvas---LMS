import React from "react";
import { Form, Button } from "react-bootstrap";
import { FillInBlankQuestion } from "../components/QuizQuestionEditor";
import { FaTrash } from "react-icons/fa";

interface FillInBlankEditorProps {
  question: FillInBlankQuestion;
  onChange: (question: FillInBlankQuestion) => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export default function FillInBlankEditor({ question, onChange, onCancel, onSave, onDelete }: FillInBlankEditorProps) {
  const extendedQuestion = question as FillInBlankQuestion;

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...extendedQuestion,
      question: e.target.value
    } as FillInBlankQuestion);
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value, 10) || 0;
    onChange({
      ...extendedQuestion,
      points: points
    } as FillInBlankQuestion);
  };

  const handleAnswerChange = (text: string) => {
    const updatedQuestion = {
      ...extendedQuestion,
      correctAnswer: text
    };    
    onChange(updatedQuestion as FillInBlankQuestion);
  };

  return (
    <div className="p-3">
      <div className="mb-3">
        <p className="instruction-text">
          <strong>Enter your question text, then define correct answer for the blank.</strong>
        </p>
      </div>
      
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Question:</Form.Label>
          <FaTrash className="text-danger float-end" style={{cursor: 'pointer'}} onClick={() => onDelete()}/>
          <Form.Control
            as="textarea"
            rows={3}
            value={question.question}
            onChange={handleQuestionTextChange}
            placeholder="How much is 2 + 2 = _____?"
          />
        </Form.Group>

        <div className="d-flex justify-content-end mb-3">
          <Form.Group>
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
          <Form.Label><strong>Answer:</strong></Form.Label>
          <Form.Control
            type="text"
            placeholder="Answer"
            value={question.correctAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex justify-content-start mt-4">
          <Button variant="outline-secondary" className="me-2" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={onSave}
            disabled={!extendedQuestion.correctAnswer}
          >
            Update Question
          </Button>
        </div>
      </Form>
    </div>
  );
}