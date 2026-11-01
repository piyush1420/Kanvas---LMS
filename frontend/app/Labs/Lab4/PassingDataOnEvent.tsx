"use client"
const add = (a: number, b: number) => {
  alert(`${a} + ${b} = ${a + b}`);
//   return a+b;
};
export default function PassingDataOnEvent() {
  return (
    <div id="wd-passing-data-on-event">
      <h2>Passing Data on Event</h2>
      <button onClick={() => add(2, 3)}
              //onClick={add(2, 3)} 
              // here when the page is rendered only the value is computed and stored, 
              //so when you refresh only you will get alert as the value is computed and rendered/ stored when page rendered
              // this makes error as onClick requires function but you give a value .
              className="btn btn-primary"
              id="wd-pass-data-click">
        Pass 2 and 3 to add()
      </button>
      <hr/>
    </div>
);}
