// reducers/index.js
import { combineReducers } from "redux";
import { apperanceReducer } from "./reducers";
// import other reducers here

const rootReducer = combineReducers({
  example: apperanceReducer,
  // other reducers
});

export default rootReducer;
