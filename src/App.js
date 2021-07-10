import "./App.css";
import Board from "./components/Board/Board";
import { Container } from "@material-ui/core";
import Navbar from "./components/navigation/Navbar";
import InputBoardWrapper from "./components/InputBoard/InputBoardWrapper";

function App() {
  return (
    <Container maxWidth="md">
      <Navbar />
      <div className="game-wrapper">
        <Board />
        <InputBoardWrapper />
      </div>
    </Container>
  );
}

export default App;
