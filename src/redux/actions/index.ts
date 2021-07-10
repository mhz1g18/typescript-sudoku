import { DIFFICULTY } from "../../lib/sudoku";
import { ActionType } from "../action-types/index";

export interface Input {
  row: number;
  col: number;
  val: number;
  isValid?: boolean;
}

interface NewGameAction {
  type: ActionType.NEW_GAME;
}

interface ResetGameAction {
  type: ActionType.RESET_GAME;
}

interface SolveGameAction {
  type: ActionType.SOLVE_GAME;
}

interface PlaceInputAction {
  type: ActionType.PLACE_INPUT;
  payload: Input;
}

interface ClearInputAction {
  type: ActionType.CLEAR_INPUT;
  payload: Input;
}

interface ChangeDifficultyAction {
  type: ActionType.CHANGE_DIFFICULTY;
  payload: DIFFICULTY;
}

interface SelectSquareAction {
  type: ActionType.SELECT_SQUARE;
  payload: number[];
}

interface UndoInputAction {
  type: ActionType.UNDO_INPUT;
}

interface RedoInputAction {
  type: ActionType.REDO_INPUT;
}

interface PauseGameAction {
  type: ActionType.PAUSE_GAME;
}

interface ResumeGameAction {
  type: ActionType.RESUME_GAME;
}

export type Action =
  | NewGameAction
  | ResetGameAction
  | SolveGameAction
  | PlaceInputAction
  | ClearInputAction
  | ChangeDifficultyAction
  | SelectSquareAction
  | UndoInputAction
  | RedoInputAction
  | PauseGameAction
  | ResumeGameAction;
