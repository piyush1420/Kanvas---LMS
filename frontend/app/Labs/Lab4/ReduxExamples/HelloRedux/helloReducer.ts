import { createSlice } from "@reduxjs/toolkit"; // bigstore/global redux store se creating a slice 
const initialState = {
  message: "Hello World",
};
const helloSlice = createSlice({
  name: "hello",
  initialState,
  reducers: {},
});
export default helloSlice.reducer;
//Every slice has a reducer function 
// that’s what tells Redux how to update this part of the state when actions happen.

//| Line                                | What it does                                               |
// | ----------------------------------- | ---------------------------------------------------------- |
// | `createSlice`                       | Creates a new section (slice) of the Redux store           |
// | `initialState`                      | Sets the default data for that slice                       |
// | `reducers`                          | (Empty for now) — will hold logic to change the data later |
// | `export default helloSlice.reducer` | Exports the reducer so the store can use it                |
