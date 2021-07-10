import { DIFFICULTY } from "./../../lib/sudoku";
import { ActionType } from "./../action-types/index";
import { Action, Input } from "./../actions/index";
// Action-creators - dispatch actions

import { Dispatch } from "redux";

export const createNewBoard = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.NEW_GAME,
    });
  };
};

export const resetBoard = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.RESET_GAME,
    });
  };
};

export const solveBoard = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SOLVE_GAME,
    });
  };
};

export const changeDifficulty = (diffuculty: DIFFICULTY) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.CHANGE_DIFFICULTY,
      payload: diffuculty,
    });
  };
};

export const placeInput = (input: Input) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.PLACE_INPUT,
      payload: input,
    });
  };
};

export const clearInput = (input: Input) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.CLEAR_INPUT,
      payload: input,
    });
  };
};

export const selectSquare = (square: number[]) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.SELECT_SQUARE,
      payload: square,
    });
  };
};

export const undoInput = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.UNDO_INPUT,
    });
  };
};

export const redoInput = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.REDO_INPUT,
    });
  };
};

export const pauseGame = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.PAUSE_GAME,
    });
  };
};

export const resumeGame = () => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.RESUME_GAME,
    });
  };
};
