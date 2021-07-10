import { combineReducers } from "redux";
import sudokuReducer from "./sudokuReducer";

const reducers = combineReducers({
  sudoku: sudokuReducer,
});

export default reducers;

export type State = ReturnType<typeof reducers>;
