import React, { useState } from "react";
import { Form, Button, FormCheck } from "react-bootstrap";
import { MultipleChoiceQuestion } from "../components/QuizQuestionEditor";

interface MultipleChoiceEditorProps {
  question: MultipleChoiceQuestion;
  onChange: (question: MultipleChoiceQuestion) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function MultipleChoiceEditor({
  question,
  onChange,
  onCancel,
  onSave
}: MultipleChoiceEditorProps) {
  const [correctAnswers, setCorrectAnswers] = useState<string>(question.correctAnswer ? question.correctAnswer : "");
  
  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...question,
      question: e.target.value
    });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value);
    onChange({
      ...question,
      points: points
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...question.options];
    updatedOptions[index] = value;
    
    onChange({
      ...question,
      options: updatedOptions
    });
  };

  const handleCorrectAnswerChange = (cAns: string) => {
    setCorrectAnswers(cAns);
    onChange({
      ...question,
      correctAnswer: cAns
    });
  };

  const addOption = (option: string) => {
    onChange({
      ...question,
      options: [...question.options, option]
    });
  };

  const removeOption = (option: string) => {
    if (question.options.length <= 2) return;
    
    const updatedOptions = question.options.filter((o) => o !== option);
    onChange({
      ...question,
      options: updatedOptions
    });

    if (updatedOptions.indexOf(correctAnswers) === -1) {
      setCorrectAnswers("");
    }
  };

  const isCorrectAnswer = (optionText: string) => {
    return correctAnswers.includes(optionText);
  };

  return (
    <div className="p-3">
      <div className="mb-3">
        <p className="instruction-text">
          <strong>Enter your question and multiple answers, then select the correct answer(s).</strong>
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
            placeholder="Enter your question"
          />
        </Form.Group>

        <div className="d-flex justify-content-between mb-3">
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
          <Form.Label><strong>Options:</strong></Form.Label>
          <div className="p-3 border rounded mb-2">
            {question.options.map((option, i) => (
              <div key={i} className="d-flex align-items-center mb-2">
                <FormCheck
                  type="radio"
                  id={`mcq-option-${i}`}
                  name="correctAnswer"
                  className="me-2"
                  checked={isCorrectAnswer(option)}
                  value={option}
                  onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                />
                <Form.Control
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  placeholder={option ? option : `Option ${i + 1}`}
                  className="me-2"
                />
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => removeOption(option)}
                  disabled={question.options.length <= 2}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline-secondary" 
            size="sm" 
            className="mt-2"
            onClick={(e) => {
              e.preventDefault();
              addOption("");
            }}
          >
            + Add Option
          </Button>
        </Form.Group>

        <div className="p-3 border rounded mb-3 bg-light">
          <Form.Label><strong>Correct Answer:</strong></Form.Label>
          <div>
            {correctAnswers ? (
              <div className="badge bg-success me-2 p-2">
                {correctAnswers}
              </div>
            ) : (
              <div className="text-danger">No correct answer selected</div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-start mt-3">
          <Button variant="outline-secondary" className="me-2" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={onSave}
            disabled={correctAnswers.length === 0}
          >
            Update Question
          </Button>
        </div>
      </Form>
    </div>
  );
}