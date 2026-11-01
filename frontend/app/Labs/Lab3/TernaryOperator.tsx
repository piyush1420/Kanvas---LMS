import React from 'react'

export default function TernaryOperator() {
    // eslint-disable-next-line prefer-const
    let loggedIn = true;
    return(
       <div id="wd-ternary-operator">
          <h4>Logged In</h4>
          { loggedIn ? <p>Welcome</p> : <p>Please login</p> } <hr/>
       </div>
    )
   
}
