"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */


import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";

import ListGroup from "react-bootstrap/esm/ListGroup";

export default function TodoList() {
  const { todos } = useSelector((state: any) => state.todosReducer);

  return (
    <div id="wd-todo-list-redux">
      <h2>Todo List</h2>
      <ListGroup>
        <TodoForm />
        {todos.map((todo: any) => (
          // eslint-disable-next-line react/jsx-key
          <TodoItem todo={todo} />
        ))}
      </ListGroup>
<hr/></div>
);}

