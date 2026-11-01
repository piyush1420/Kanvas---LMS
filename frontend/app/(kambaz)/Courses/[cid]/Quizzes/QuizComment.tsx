/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import * as quizClient from "./client";
import { useSelector } from "react-redux";

export default function QuizComment({quiz}: {quiz: any}) {
  const currentUser = useSelector((state: any) => state.accountReducer.currentUser);
  const [q, setQ] = useState([{}]);
  const [attempt, setAttempt] = useState({score: "-"});

  const totalQuestions = async(quiz: any) => {
    try {
      const questions = await quizClient.getQuestionsForQuiz(quiz.course, quiz._id);
      setQ(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  const lastAttempt = async (quiz: any) => {
    try {
      const attempt = await quizClient.findQuizAttemptById(quiz.course, quiz._id, currentUser._id);
      if (attempt && attempt.length !== 0) {
        setAttempt(attempt[0]);
      }
    } catch (error) {
      console.error("Error fetching attempt:", error);
    }
  }

  useEffect(() => {
    if (quiz && quiz._id) {
      totalQuestions(quiz);
      if (currentUser && currentUser.role === "STUDENT") {
        lastAttempt(quiz);
      }
    }
  }, [quiz]);

  const Availability = () => {
    const currentDate = new Date();
    const availableFrom = new Date(quiz.availableFrom);
    const availableUntil = new Date(quiz.availableUntil || quiz.until);
    const dueDate = new Date(quiz.due);

    if (!quiz.availableFrom || !quiz.due) {
      return <span>Always available</span>;
    }

    if (currentDate < availableFrom) {
      return <span>Not available until {quiz.availableFrom}</span>;
    } else if (currentDate > availableUntil || currentDate > dueDate) {
      return <span>Closed</span>;
    } else {
      return <span>Available</span>;
    }
  }

  const lastScore = () => {
    return <span>{attempt.score || "-"}</span>;
  }

  return (
    <div>
      <span className="wd-assignment-info d-block mt-1 ps-5">
        {Availability()} | Due {quiz.due || "No due date"} | {quiz.points || 0} pts | {q.length} Questions 
        {currentUser?.role === "STUDENT" && <> | Score {lastScore()} / {quiz.points || 0} pts</>}
      </span>
    </div> 
  );
}