import Link from "next/link";
import Lab1 from "./Lab1/page";
export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <ul>
        <li>
          <Link href="/Labs/Lab1" id="wd-lab1-link">
            Lab 1: HTML Examples </Link>
        </li>
        <li>
          <Link href="/Labs/Lab2" id="wd-lab2-link">
            Lab 2: CSS Basics </Link>
        </li>
        <li>
          <Link href="/Labs/Lab3" id="wd-lab3-link">
            Lab 3: JavaScript Fundamentals </Link>
        </li>
        <li>
          <Link href="/Labs/Lab4" id="wd-lab4-link">
            Lab 4: Maintaining State in React Applications </Link>
        </li>
      </ul>
      <div id="wd-personal-info">
        <h2>Student Information</h2>
        <li><strong>Name:</strong> Piyush Daga</li>
        <li><strong>Section:</strong> 05 | CRN: 19730 | Online</li>
        <li>
        <Link href="/" id="wd-kambaz-link">
          Kambaz </Link>
      </li>
      <li>
        <Link href="https://github.com/piyush1420/kambaz-next-js/tree/a3" id="wd-github-link">
          Github repo </Link>
      </li>
      </div>
      <div className="center-container"> <Lab1/></div>
      
    </div>
  );
}