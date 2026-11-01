/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function ArrayStateVariable() {
    const { todos } = useSelector((state: any) => state.todosReducer);

// first thing is we are making array as a variable that is being dynamically updated by UI
 const [array, setArray] = useState([1, 2, 3, 4, 5]);
 //when we click add element it adds any random element to the existing array
 const addElement = () => {
   setArray([...array, Math.floor(Math.random() * 100)]);
 };
 // to delete
const deleteElement = (index: number) => {
   setArray(array.filter((item, i) => i !== index));//matching index gets removed
 };
 return (
  <div id="wd-array-state-variables" className="container mt-3">
   <h2>Array State Variable</h2>

   <ListGroup>
        {todos.map((todo: any) => (
          <ListGroupItem key={todo.id}>
            {todo.title}
          </ListGroupItem>
        ))}
      </ListGroup>
      
      <hr />
   <button className="btn btn-success mb-3" onClick={addElement}>Add Element</button>
   <ul className="list-group">
    {array.map((item, index) => (
     <li key={index}
        className="list-group-item d-flex justify-content-between align-items-center"
     > {item}
      <button onClick={() => deleteElement(index)}
              className="btn btn-danger"
        >
       Delete</button>
     </li>))}
   </ul><hr/></div>);}

