import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators, State } from "../../redux";
import UndoIcon from "@material-ui/icons/Undo";
import RedoIcon from "@material-ui/icons/Redo";
import DeleteIcon from "@material-ui/icons/HighlightOff";
import PauseIcon from "@material-ui/icons/Pause";
import ResumeIcon from "@material-ui/icons/PlayArrow";
import { makeStyles } from "@material-ui/core";
import StopWatch from "./StopWatch";

const useStyles = makeStyles({
  icon: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  switchIcons: {
    marginTop: "2px",
    "&:hover": {
      color: "red",
    },
  },
});

const InputBoardWrapper: FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { placeInput, undoInput, redoInput, pauseGame, resumeGame } =
    bindActionCreators(actionCreators, dispatch);

  const { selectedSquare, undoStack, redoStack, isPaused } = useSelector(
    (state: State) => state.sudoku
  );

  const pauseGameHandler = () => {
    if (isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  };

  const onClickHandler = (val: number) => {
    if (selectedSquare.length === 0) {
      return;
    }

    const [row, col] = selectedSquare;
    placeInput({
      row,
      col,
      val,
    });
  };

  const undoActionClickHandler = () => {
    if (!undoStack.length) return;

    undoInput();
  };

  const redoActionClickHandler = () => {
    if (!redoStack.length) return;

    redoInput();
  };

  return (
    <div className="controls-wrapper">
      <div className="timer">
        <StopWatch />
        <span style={{ paddingRight: "1em" }}>
          {isPaused ? (
            <ResumeIcon
              className={classes.switchIcons}
              onClick={pauseGameHandler}
            />
          ) : (
            <PauseIcon
              className={classes.switchIcons}
              onClick={pauseGameHandler}
            />
          )}
        </span>
      </div>
      <div className="pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, idx) => (
          <div
            key={`control-${idx}`}
            className="pad-item"
            onClick={(e) => onClickHandler(num)}
          >
            {num}
          </div>
        ))}
        <div className="pad-item" onClick={() => onClickHandler(0)}>
          <DeleteIcon className={classes.icon} />
        </div>
        <div className="pad-item" onClick={undoActionClickHandler}>
          <UndoIcon
            className={classes.icon}
            color={!undoStack.length ? "disabled" : "primary"}
          />
        </div>
        <div className="pad-item" onClick={redoActionClickHandler}>
          <RedoIcon
            className={classes.icon}
            color={!redoStack.length ? "disabled" : "primary"}
          />
        </div>
      </div>
    </div>
  );
};

export default InputBoardWrapper;
