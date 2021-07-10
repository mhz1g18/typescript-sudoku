import { FC, MouseEvent, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import useKeypress from "../../hooks/useKeyPress";
import { actionCreators, State } from "../../redux";
import { Input } from "../../redux/actions";

const digitKeys: string = "0123456789";

interface BoardProps {}

const Board: FC<BoardProps> = () => {
  const dispatch = useDispatch();
  const { createNewBoard, placeInput, clearInput, selectSquare } =
    bindActionCreators(actionCreators, dispatch);
  const { board, initialBoard, inputs, selectedSquare, isPaused } = useSelector(
    (state: State) => state.sudoku
  );

  const squareRefs = useRef(new Array(81));

  const handleSquareClick = (
    e: MouseEvent<HTMLElement>,
    rowIdx: number,
    colIdx: number
  ): void => {
    if (initialBoard[rowIdx][colIdx] !== 0 || isPaused) return;

    const arrPos: number = rowIdx * 9 + colIdx;

    if (selectedSquare.length > 0) {
      const selectedPos: number = selectedSquare[0] * 9 + selectedSquare[1];
      squareRefs.current[selectedPos].classList.remove("box-selected");

      if (selectedPos === arrPos) {
        selectSquare([rowIdx, colIdx]);
        return;
      }
    }

    selectSquare([rowIdx, colIdx]);
    const ref: HTMLDivElement = squareRefs.current[arrPos];
    ref.classList.add("box-selected");
  };

  const handleKeyPress = useCallback(
    ({ key }: any): void => {
      const digit: number = Number.parseInt(key);

      if (!(digit >= 0 && digit < 10) || selectedSquare.length === 0) {
        return;
      }

      const [row, col] = selectedSquare;

      if (digit === 0) {
        clearInput({ row, col, val: digit });
        return;
      }

      placeInput({
        row,
        col,
        val: digit,
      });
    },
    [selectedSquare, clearInput, placeInput]
  );

  useKeypress(digitKeys, handleKeyPress);

  useEffect(() => {
    createNewBoard();
  }, []);

  useEffect(() => {
    if (inputs.length === 0) {
      squareRefs.current.forEach((ref) => {
        ref.classList.remove("box-incorrect");
        ref.classList.remove("box-correct");
      });
    }

    inputs.forEach((input: Input) => {
      const { row, col, val, isValid } = input;
      const refIdx = row * 9 + col;
      if (val === 0) {
        squareRefs.current[refIdx].classList.remove("box-incorrect");
        squareRefs.current[refIdx].classList.remove("box-correct");
      } else if (isValid) {
        squareRefs.current[refIdx].classList.remove("box-incorrect");
        squareRefs.current[refIdx].classList.add("box-correct");
      } else {
        squareRefs.current[refIdx].classList.remove("box-correct");
        squareRefs.current[refIdx].classList.add("box-incorrect");
      }
    });
  }, [inputs]);

  return (
    <div className="board-wrapper">
      <div className="board">
        {board.map((row: number[], rowIdx: number) =>
          row.map((col, colIdx) => (
            <div
              className="box-wrapper"
              key={`box-wrapper-${rowIdx}-${colIdx}`}
              ref={(ref) => (squareRefs.current[rowIdx * 9 + colIdx] = ref)}
              onClick={(e) => handleSquareClick(e, rowIdx, colIdx)}
              data-x={rowIdx}
              data-y={colIdx}
              data-section={rowIdx}
            >
              <div className="box">
                <span>{col > 0 && col}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
