/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Alert, Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import QuizControls from "./QuizControls";
import { IoRocketOutline } from "react-icons/io5";
import * as quizClient from "./client";
import { useEffect, useState } from "react";
import QuizComment from "./QuizComment";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

export default function Quizzes() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { cid } = useParams();
  const [quizList, setQuizzes] = useState([]);
  const router = useRouter();

  const fetchQuizzes = async () => {
    const quizzes = await quizClient.getQuizzesForCourse(cid);
    setQuizzes(quizzes);
    return quizzes;
  }

  const Availability = (quiz: any) => {
    const currentDate = new Date();
    const availableFrom = new Date(quiz.availableFrom);
    const availableUntil = new Date(quiz.availableUntil);
    const dueDate = new Date(quiz.due);

    if (currentDate < availableFrom || currentDate > availableUntil || currentDate > dueDate) {
        return false;
    } else{
        return true;
    }
  }

  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

  return (
    <div className="wd-quizzes p-4">
      
      <div id="input-group" className="d-flex justify-content-end mb-3">
        <input className="rounded-3 me-2 fs-5 form-control w-25" placeholder="🔍 Search for Quiz" id="wd-search-quiz" />
        { currentUser.role === "FACULTY" && (
          <Button className="btn btn-danger btn-lg" id="wd-add-quiz" onClick={
            async () => {
              const qu = {
                _id: uuidv4(),
                title: "New Quiz",
                course: cid,
                published: false,
                description: "New Quiz"
              };
              await quizClient.createQuiz(cid, qu._id, qu);
              setQuizzes([...quizList, qu] as any);
              router.push(`/Courses/${cid}/Quizzes/${qu._id}/details`);
            }
          }>
          <FaPlus className="position-relative me-2" />
            Quiz
          </Button>          
          )
        }
      </div>

      <h3 className="bg-secondary ps-2 mt-2 rounded-1 fw-bold dropdown-toggle w-100">Quizzes</h3>

      {currentUser.role === "FACULTY" && quizList.length === 0 && (
        <Alert>
          <Alert.Heading className="text-center">No Quizzes Created</Alert.Heading>
          <p className="text-center">Click on the + Quiz button to create a new quiz.</p>
        </Alert>
      )}

      {currentUser.role === "STUDENT" && quizList.length === 0 && (
        <Alert>
          <Alert.Heading className="text-center">No Quizzes Available</Alert.Heading>
        </Alert>
      )}

      {currentUser.role === "FACULTY" && (
        <div className="wd-quiz-list">
          <ListGroup className="list-group">
            {quizList.map((quiz: any) => (
              <ListGroupItem key={quiz._id} className="list-group-item">
                <IoRocketOutline className="text-success me-2 fs-5" />
                <Link href={`/Courses/${cid}/Quizzes/${quiz._id}/details`} className="wd-quiz-link text-decoration-none">
                  {quiz.title}
                </Link>
                <QuizControls quiz={quiz} setQuizzes={setQuizzes} quizList={quizList}/> 
                <QuizComment quiz={quiz} />
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
      )}

      {currentUser.role === "STUDENT" && (
        <div className="wd-quiz-list">
          <ListGroup className="list-group">
            {quizList.map((quiz: any) => quiz.published ? (
              <ListGroupItem key={quiz._id} className="list-group-item">
                <IoRocketOutline className="text-success me-2 fs-5" />
                <Button 
                  disabled={!Availability(quiz)} 
                  onClick={() => router.push(`/Courses/${cid}/Quizzes/${quiz._id}/details`)}
                  className="link bg-white text-decoration-underline text-dark border-0 fw-bold fs-5 p-1"
                >
                  {quiz.title}
                </Button>
                <QuizControls quiz={quiz} quizList={quizList} setQuizzes={setQuizzes} />
                <QuizComment quiz={quiz} />
              </ListGroupItem>
            ) : null)}
          </ListGroup>
        </div>
      )}
    </div>
  );
}