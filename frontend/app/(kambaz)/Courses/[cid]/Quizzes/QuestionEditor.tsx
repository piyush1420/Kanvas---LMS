"use client";
import { useState, useEffect } from "react";

// Import the question type editors
import MultipleChoiceEditor from "./QuestionTypes/MultipleChoiceEditor";
import TrueFalseEditor from "./QuestionTypes/TrueFalseEditor";
import FillInBlankEditor from "./QuestionTypes/FillInBlankEditor";

// Import types from QuizQuestionEditor
import type { 
  Question, 
  MultipleChoiceQuestion, 
  TrueFalseQuestion, 
  FillInBlankQuestion 
} from "./components/QuizQuestionEditor";

interface QuestionEditorProps {
  question: Question;
  onEdit: () => void;
  onSave: (question: Question) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function QuestionEditor({
  question,
  onEdit,
  onSave,
  onCancel,
  onDelete
}: QuestionEditorProps) {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);

  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  const handleSave = () => {
    onSave(editedQuestion);
  };

  const renderQuestionEditor = () => {
    switch (editedQuestion.type) {
      case "MULTIPLE_CHOICE":
        return (
          <MultipleChoiceEditor 
            question={editedQuestion as MultipleChoiceQuestion}
            onChange={updatedQuestion => setEditedQuestion(updatedQuestion)}
            onCancel={onCancel}
            onSave={handleSave}
          />
        );
      
      case "TRUE_FALSE":
        return (
          <TrueFalseEditor 
            question={editedQuestion as TrueFalseQuestion}
            onChange={updatedQuestion => setEditedQuestion(updatedQuestion)}
            onCancel={onCancel}
            onSave={handleSave}
          />
        );
      
      case "FILL_IN_BLANK":
        return (
          <FillInBlankEditor 
            question={editedQuestion as FillInBlankQuestion}
            onChange={updatedQuestion => setEditedQuestion(updatedQuestion)}
            onCancel={onCancel}
            onSave={handleSave}
            onDelete={onDelete}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="question-editor mb-4">
      {renderQuestionEditor()}
    </div>
  );
}