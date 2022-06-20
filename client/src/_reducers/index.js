import { combineReducers } from "redux";
import user from "./user_reducer";
import college from "./college_reducer";

const rootReducer = combineReducers({
  user,
  college,
});

export default rootReducer;
