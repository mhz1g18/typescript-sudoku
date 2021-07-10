export enum DIFFICULTY {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

const difficultyMappings: {
  [key in DIFFICULTY]: number[];
} = {
  EASY: [20, 30],
  MEDIUM: [31, 40],
  HARD: [41, 50],
};

const emptyBoard: number[][] = new Array(9)
  .fill(0)
  .map((r) => new Array(9).fill(0));

function genFullBoard(): number[][] {
  return solve(emptyBoard);
}

function generateRandomPuzzle(difficulty: DIFFICULTY): number[][] {
  const randomFilledBoard = genFullBoard();
  const cellIndexes = [];

  let missingClues = 0;
  const [lowerBoundMissingClues, upperBoundMissingClues] =
    difficultyMappings[difficulty];
  const randomBound = getRandomInt(
    lowerBoundMissingClues,
    upperBoundMissingClues
  );

  // Populate Cell Indexes Array
  for (let i = 0; i < randomFilledBoard.length; i++) {
    for (let j = 0; j < randomFilledBoard[i].length; j++) {
      cellIndexes.push([i, j, randomFilledBoard[i][j]]);
    }
  }

  // Shuffle Cell Indexes
  const cellIndexesShuffled = shuffle(10, cellIndexes);

  while (cellIndexesShuffled.length > 25 && missingClues !== randomBound) {
    const [row, col, cellValue] = cellIndexesShuffled.pop();
    const solutions: number[][][] = [];
    randomFilledBoard[row][col] = 0;
    solve(randomFilledBoard, solutions, true);

    if (solutions.length === 1) {
      missingClues++;
      continue;
    } else {
      missingClues--;
      randomFilledBoard[row][col] = cellValue;
    }
  }
  console.log(difficulty);
  console.log(missingClues);

  return randomFilledBoard;
}

export function solve(
  board: number[][],
  solutions: number[][][] = [],
  countSolutions = false,
  returnAnimations = false
): number[][] | any[] {
  const copyBoard = [...board].map((row) => [...row]);
  const animations: any[] = [];
  solveHelper(copyBoard, 0, 0, solutions, countSolutions, animations);

  return returnAnimations ? animations : copyBoard;
}

function solveHelper(
  board: number[][],
  row: number,
  col: number,
  solutions: number[][][],
  countSolutions: boolean,
  animations: any[]
): boolean | undefined {
  if (col === board[row].length) {
    col = 0;
    row += 1;

    if (row === board.length) {
      if (countSolutions) {
        solutions.push(board);
        return;
      }
      return true;
    }
  }

  animations.push({
    row,
    col,
    classAdd: ["currentElement"],
    classRemove: [],
  });

  if (board[row][col] === 0) {
    return tryDigitsAtPosition(
      board,
      row,
      col,
      solutions,
      countSolutions,
      animations
    );
  }

  animations.push({
    row,
    col,
    digit: board[row][col],
    classAdd: ["correctElement"],
    classRemove: ["currentElement"],
  });

  const correct = solveHelper(
    board,
    row,
    col + 1,
    solutions,
    countSolutions,
    animations
  );

  if (!correct) {
    animations.push({
      row,
      col,
      digit: board[row][col],
      classAdd: [],
      classRemove: ["correctElement"],
    });
  }

  return correct;
}

function tryDigitsAtPosition(
  board: number[][],
  row: number,
  col: number,
  solutions: number[][][],
  countSolutions: boolean,
  animations: any[]
) {
  const digits = shuffle(10, [1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (let i = 0; i < 9; i++) {
    const choice = digits[i];
    animations.push({
      row,
      col,
      classAdd: ["currentElement"],
      classRemove: [],
      digit: choice,
    });
    if (isValidMove(board, row, col, choice)) {
      board[row][col] = choice;

      const isValidMove = solveHelper(
        board,
        row,
        col + 1,
        solutions,
        countSolutions,
        animations
      );

      if (isValidMove && !countSolutions) {
        animations.push({
          row,
          col,
          classAdd: ["correctElement"],
          classRemove: ["currentElement"],
          digit: choice,
        });
        return true;
      } else if (solutions.length > 2) {
        return;
      } else if (!isValidMove) {
        animations.push({
          row,
          col,
          digit: choice,
          classAdd: ["wrongElement"],
          classRemove: ["currentElement"],
        });
      }
    }
  }

  animations.push({
    row,
    col,
    classAdd: [],
    classRemove: ["currentElement", "wrongElement"],
    digit: 0,
  });
  board[row][col] = 0;
  return false;
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(iterations = 1, array: any[]): any[] {
  const copyArray = [...array];

  for (let i = 0; i < iterations; i++) {
    let idx = copyArray.length;

    while (idx !== 0) {
      // get a random int between [0, idx]
      const randomIdx = Math.floor(Math.random() * idx);
      idx--;

      [copyArray[idx], copyArray[randomIdx]] = [
        copyArray[randomIdx],
        copyArray[idx],
      ];
    }
  }

  return copyArray;
}

function isValidMove(
  board: number[][],
  row: number,
  col: number,
  digit: number
): boolean {
  // Check Row
  for (let colIdx = 0; colIdx < board[row].length; colIdx++) {
    if (board[row][colIdx] === digit) return false;
  }

  // Check Col
  for (let rowIdx = 0; rowIdx < board.length; rowIdx++) {
    if (board[rowIdx][col] === digit) return false;
  }

  // Check quadrant
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
    for (let colIdx = 0; colIdx < 3; colIdx++) {
      const calcRow = startRow + rowIdx;
      const calcCol = startCol + colIdx;

      if (board[calcRow][calcCol] === digit) return false;
    }
  }

  return true;
}

/* function prettyPrint(board: number[][]): void {
  console.log("[");
  for (let i = 0; i < board.length; i++) {
    let output = "[ ";
    for (let j = 0; j < board[i].length; j++) {
      output += board[i][j];
      output += j === board[i].length - 1 ? " ]" : ", ";
    }
    console.log(output);
  }
  console.log("]");
}

function equalBoards(board1: any[], board2: any[]): boolean {
  if (!Array.isArray(board1) && !Array.isArray(board2)) {
    return board1 === board2;
  }

  if (board1.length !== board2.length) {
    return false;
  }

  for (var i = 0, len = board1.length; i < len; i++) {
    if (!equalBoards(board1[i], board2[i])) {
      return false;
    }
  }

  return true;
}
 */
export { generateRandomPuzzle, isValidMove };
