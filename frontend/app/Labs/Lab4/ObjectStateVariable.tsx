import { useState } from "react";
import { FormControl } from "react-bootstrap";
export default function ObjectStateVariable() {
  const [person, setPerson] = useState({ name: "Peter", age: 24 });
  return (
    <div>
      <h2>Object State Variables</h2>
      {/* <pre> tag:
            “Show the text exactly as it is written —
            including spaces, tabs, and line breaks.” */}
      <pre>{JSON.stringify(person, null, 2)}</pre>
      <FormControl
        defaultValue={person.name}
        // ...person copies all properties into a new object so React can update the screen properly.
        // We copy everything from the old object,
        // and override only the changed part.
        onChange={(e) => setPerson({ ...person, name: e.target.value })}
      />
      <FormControl
        defaultValue={person.age} type="number"
        onChange={(e) => setPerson({ ...person,
                                     age: parseInt(e.target.value) })}
      />
      <hr/>
    </div>
  );
}

