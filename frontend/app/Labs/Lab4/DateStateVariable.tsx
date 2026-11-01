import { useState } from "react";
import { FormControl } from "react-bootstrap";
export default function DateStateVariable() {
  const [startDate, setStartDate] = useState(new Date());// assign current date 
  // just formatting date as JS date has all timezone and all
  const dateObjectToHtmlDateString = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? 0 : ""}${
      date.getMonth() + 1
    }-${date.getDate() + 1 < 10 ? 0 : ""}${date.getDate() + 1}`;
  };
  return (
    <div id="wd-date-state-variables">
      <h2>Date State Variables</h2>
      {/* Why do we need to convert Dates?

        Because React state stores a Date object, but HTML <input type="date"> only accepts a string. */}
      <h3>{JSON.stringify(startDate)}</h3>

      <h3>{dateObjectToHtmlDateString(startDate)}</h3>
      <FormControl
        type="date"
        defaultValue={dateObjectToHtmlDateString(startDate)}
        //  e.target.value is built-in
        onChange={(e) => setStartDate(new Date(e.target.value))}
      />
<hr/></div>);}