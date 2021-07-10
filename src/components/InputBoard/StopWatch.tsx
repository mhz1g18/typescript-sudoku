import { useEffect } from "react";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators, State } from "../../redux";

const StopWatch: FC = () => {
  const [time, setTime] = useState<number>(0);

  const dispatch = useDispatch();
  const { pauseGame, resumeGame } = bindActionCreators(
    actionCreators,
    dispatch
  );
  const { isPaused } = useSelector((state: State) => state.sudoku);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!isPaused) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      interval && clearInterval(interval);
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isPaused]);

  return (
    <span style={{ paddingLeft: "1em" }}>
      Time: {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
      {("0" + Math.floor((time / 1000) % 60)).slice(-2)}.{" "}
      {("0" + ((time / 10) % 100)).slice(-2)}
    </span>
  );
};

export default StopWatch;
