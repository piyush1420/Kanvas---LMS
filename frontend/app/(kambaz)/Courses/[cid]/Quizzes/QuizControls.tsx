/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { BsBan, BsCheckCircleFill, BsThreeDotsVertical } from "react-icons/bs";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import * as quizClient from "./client";
import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";

export default function QuizControlButtons({quiz, quizList, setQuizzes}: {quiz: any; quizList: any; setQuizzes: any}) {
  const { cid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [publish, setPublish] = useState(quiz.published);

  const publishQuiz = async() => {
    const status = await quizClient.publishQuiz(quiz.course, quiz._id, quiz);
    if (status === 200) {
      setPublish(true);
    } else {
      console.error("Failed to publish quiz");
    }
  }

  const unpublishQuiz = async () => {
    const status = await quizClient.unpublishQuiz(quiz.course, quiz._id, quiz);
    if (status === 200) {
      setPublish(false);
    } else {
      console.error("Failed to unpublish quiz");
    }
  }

  const deleteQuiz = async () => {
    await quizClient.deleteQuiz(quiz.course, quiz._id);
    setQuizzes(quizList.filter((q: any) => q._id !== quiz._id));
  }

  return (
    <div className="float-end">
      {publish ? 
        <BsCheckCircleFill className="text-success fs-5 me-2" /> : 
        <BsBan className="fs-5 text-danger me-2" />
      }
      {currentUser.role === "FACULTY" && (
        <div className="float-end">
          <Dropdown drop="down">
            <Dropdown.Toggle as="div" id="dropdown-custom-toggle" style={{cursor: 'pointer'}}>
              <BsThreeDotsVertical className="fs-5"/>
            </Dropdown.Toggle>
            <Dropdown.Menu className="text-secondary">
              {publish ? 
                <Dropdown.Item onClick={unpublishQuiz}>Unpublish</Dropdown.Item> : 
                <Dropdown.Item onClick={publishQuiz}>Publish</Dropdown.Item>
              }
              <Dropdown.Item onClick={() => router.push(`/Courses/${cid}/Quizzes/${quiz._id}/edit`)}>
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={deleteQuiz}>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
    </div> 
  );
}