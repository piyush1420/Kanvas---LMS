"use client" // for interactions like onClick and all on browser by componnt is server/static, to make it browser/ dynamic use this

import React from 'react'
import store from "../store";
import ClickEvent from './ClickEvent'
import PassingDataOnEvent from './PassingDataOnEvent'
import PassingFunctions from './PassingFunctions';
import EventObject from './EventObject';
import Counter from './Counter';
import BooleanStateVariables from './BooleanStateVariables';
import StringStateVariables from './StringStateVariables';
import DateStateVariable from './DateStateVariable';
import ObjectStateVariable from './ObjectStateVariable';
import ArrayStateVariable from './ArrayStateVariable';
import ParentStateComponent from './ParentStateComponent';
import ReduxExamples from './ReduxExamples';


import { Provider } from "react-redux";
import HelloRedux from './ReduxExamples/HelloRedux';

export default function Lab4() {
    //subfunction
    function sayHello() {
        alert("Hello");
      }
    
  return (
    <Provider store={store}>

        <div id="wd-lab4">
            <h2>Lab 4</h2>
            <h3>Maintaining State in React Applications</h3>
            <ClickEvent/>
            <PassingDataOnEvent/>
            <PassingFunctions theFunction={sayHello} />
            <EventObject/>
            <Counter/>
            <BooleanStateVariables/>
            <StringStateVariables/>
            <DateStateVariable/>
            <ObjectStateVariable/>
            <ArrayStateVariable/>
            <ParentStateComponent/>

            <ReduxExamples/>
            
        </div>
    </Provider>
  )
}
