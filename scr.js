let board = document.getElementById("board"),
  scoreBoard = document.getElementById("score"),
  btnStart = document.getElementById("btnStart"),
  gameOverSign = document.getElementById("gameOverPanel");
const gameSpeed = 100;
const boardSize = 10;
const squareTypes = {
  emptySquare: 0,
  snakeSquare: 1,
  foodSquare: 2,
};
const directions = {
  ArrowUp: -10,
  ArrowDown: 10,
  ArrowLeft: -1,
  ArrowRight: 1,
};
//Game varibles
let snake, boardSquares, emptySquares, score, direction, moveInterval;

const createBoard = () => {
  boardSquares.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const squareValue = `${rowIndex}${columnIndex}`;
      const squareElement = document.createElement("div");
      squareElement.setAttribute("class", "square emptySquare");
      squareElement.setAttribute("id", squareValue);
      board.appendChild(squareElement);
      emptySquares.push(squareValue);
    });
  });
};

const createRandomFood = () => {
  const randomFood =
    emptySquares[Math.floor(Math.random() * emptySquares.length)];
  drawSquare(randomFood, "foodSquare");
};
const updateScore = () => {
  scoreBoard.innerText = score;
};
const setDirection = (newDirection) => {
  direction = newDirection;
};
const directionEvent = (key) => {
  switch (key.code) {
    case "ArrowUp":
      direction != "ArrowDown" && setDirection(key.code);
      break;
    case "ArrowDown":
      direction != "ArrowUp" && setDirection(key.code);
      break;
    case "ArrowLeft":
      direction != "ArrowRight" && setDirection(key.code);
      break;
    case "ArrowRight":
      direction != "ArrowLeft" && setDirection(key.code);
      break;
  }
};
const drawSnake = () => {
  snake.forEach((square) => drawSquare(square, "squareSnake"));
};
const drawSquare = (square, type) => {
  const [row, column] = square.split("");
  boardSquares[row][column] = squareTypes[type];
  const squareElement = document.getElementById(square);
  squareElement.setAttribute("class", `square ${type}`);
  if (type == "emptySquare") {
    emptySquares.push(square);
  } else {
    if (emptySquares.indexOf(square) !== -1) {
      emptySquares.splice(emptySquares.indexOf(square), 1);
    }
  }
};
const gameOver = () => {
  gameOverSign.style.display = "block";
  clearInterval(moveInterval);
  btnStart.disabled = false;
};
const addFood = () => {
  score++;
  updateScore();
  createRandomFood();
};
const moveSnake = () => {
  const newSquare = String(
    Number(snake[snake.length - 1]) + directions[direction]
  ).padStart(2, "0");
  console.log(snake[snake.length - 1] + directions[direction]);
  const [row, column] = newSquare.split("");

  if (
    newSquare < 0 ||
    newSquare > boardSize * boardSize ||
    (direction === "ArrowRight" && column == 0) ||
    (direction === "ArrowLeft" && column == 9) ||
    boardSquares[row][column] === squareTypes.snakeSquare
  ) {
    gameOver();
  } else {
    snake.push(newSquare);
    if (boardSquares[row][column] === squareTypes.foodSquare) {
      addFood();
    } else {
      const emptySquare = snake.shift();
      drawSquare(emptySquare, "emptySquare");
    }
    drawSnake();
  }
};
const setGame = () => {
  snake = ["00", "01", "02", "03"];
  scoreBoard = snake.length;

  direction = "ArrowRight";
  boardSquares = Array.from(Array(boardSize), () =>
    new Array(boardSize).fill(squareTypes.emptySquare)
  );

  board.innerHTML = "";
  emptySquares = [];
  createBoard();
};

const startGame = () => {
  setGame();
  gameOverSign.style.display = "none";
  btnStart.disabled = true;
  drawSnake();
  updateScore();
  createRandomFood();
  document.addEventListener("keydown", directionEvent);
  moveInterval = setInterval(() => moveSnake(), gameSpeed);
};
btnStart.addEventListener("click", startGame);
document.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    startGame();
  }
});
