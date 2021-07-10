import { Input } from "./../actions/index";
import { ActionType } from "./../action-types/index";
import * as Sudoku from "../../lib/sudoku";
import { Action } from "../actions";

const emptyBoard: number[][] = new Array(9)
  .fill(0)
  .map(() => new Array(9).fill(0));

interface SudokuState {
  board: number[][];
  initialBoard: number[][];
  difficulty: Sudoku.DIFFICULTY;
  inputs: Input[];
  selectedSquare: number[];
  redoStack: Input[];
  undoStack: Input[];
  isPaused: boolean;
}

const initialState: SudokuState = {
  board: emptyBoard,
  initialBoard: emptyBoard,
  difficulty: Sudoku.DIFFICULTY.EASY,
  inputs: [],
  selectedSquare: [],
  undoStack: [],
  redoStack: [],
  isPaused: false,
};

const sudokuReducer = (state: SudokuState = initialState, action: Action) => {
  if (state.isPaused && action.type !== ActionType.RESUME_GAME) {
    return { ...state };
  }

  switch (action.type) {
    case ActionType.NEW_GAME: {
      const newBoard = Sudoku.generateRandomPuzzle(state.difficulty);
      return {
        ...state,
        board: newBoard,
        initialBoard: newBoard,
        inputs: [],
      };
    }
    case ActionType.RESET_GAME: {
      return {
        ...state,
        board: state.initialBoard,
        inputs: [],
        undoStack: [],
        redoStack: [],
      };
    }
    case ActionType.SOLVE_GAME: {
      const solvedBoard = Sudoku.solve(state.initialBoard);
      return {
        ...state,
        board: solvedBoard,
        inputs: [],
      };
    }
    case ActionType.CHANGE_DIFFICULTY: {
      return {
        ...state,
        difficulty: action.payload,
      };
    }
    case ActionType.PLACE_INPUT: {
      const { row, col, val } = action.payload;

      if (state.board[row][col] === val) {
        return {
          ...state,
        };
      }

      const copyBoard = [...state.board].map((row) => [...row]);
      const oldVal = copyBoard[row][col];

      const isValid = Sudoku.isValidMove(copyBoard, row, col, val);
      copyBoard[row][col] = val;

      const filteredInputs = state.inputs.filter(
        ({ row: iRow, col: iCol }: Input) => !(iRow === row && iCol === col)
      );

      return {
        ...state,
        inputs: [...filteredInputs, { row, col, val, isValid }],
        undoStack: [...state.undoStack, { row, col, val: oldVal, isValid }],
        board: copyBoard,
      };
    }
    case ActionType.CLEAR_INPUT: {
      const { row, col } = action.payload;

      if (state.board[row][col] === 0) {
        return {
          ...state,
        };
      }

      const copyBoard = [...state.board].map((row) => [...row]);
      copyBoard[row][col] = 0;

      const filteredInputs = state.inputs.filter(
        ({ row: iRow, col: iCol }: Input) => !(iRow === row && iCol === col)
      );

      return {
        ...state,
        board: copyBoard,
        inputs: [...filteredInputs, { row, col, val: 0 }],
      };
    }
    case ActionType.SELECT_SQUARE: {
      const [row, col] = action.payload;
      const [selectedRow, selectedCol] = state.selectedSquare;

      return {
        ...state,
        selectedSquare:
          row === selectedRow && col === selectedCol ? [] : [row, col],
      };
    }
    case ActionType.UNDO_INPUT: {
      const undoStack = [...state.undoStack];
      const { row, col, val: oldVal, isValid } = undoStack.pop()!;
      const copyBoard = [...state.board].map((row) => [...row]);

      const inputs = [...state.inputs].map((input: Input) =>
        input.row === row && input.col === col
          ? {
              row,
              col,
              val: oldVal,
              isValid: Sudoku.isValidMove(copyBoard, row, col, oldVal),
            }
          : input
      );

      copyBoard[row][col] = oldVal;
      const curValue = state.board[row][col];

      return {
        ...state,
        board: copyBoard,
        inputs: inputs,
        undoStack: undoStack,
        redoStack: [...state.redoStack, { row, col, val: curValue, isValid }],
      };
    }
    case ActionType.REDO_INPUT: {
      const redoStack = [...state.redoStack];
      const { row, col, val: oldVal } = redoStack.pop()!;

      const curValue = state.board[row][col];
      const copyBoard = [...state.board].map((row) => [...row]);

      const inputs = [...state.inputs].map((input: Input) =>
        input.row === row && input.col === col
          ? {
              row,
              col,
              val: oldVal,
              isValid: Sudoku.isValidMove(copyBoard, row, col, oldVal),
            }
          : input
      );

      copyBoard[row][col] = oldVal;

      return {
        ...state,
        board: copyBoard,
        redoStack: redoStack,
        inputs: inputs,
        undoStack: [...state.undoStack, { row, col, val: curValue }],
      };
    }
    case ActionType.PAUSE_GAME: {
      return {
        ...state,
        isPaused: true,
      };
    }
    case ActionType.RESUME_GAME: {
      return {
        ...state,
        isPaused: false,
      };
    }
    default: {
      return state;
    }
  }
};

export default sudokuReducer;
