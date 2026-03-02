// Tic Tac Toe Game
function createGame(playerMarkers = { X: "X", O: "O" }) {
  let currentPlayer = "X"; // 'X' or 'O'
  const board = Array(9).fill("");

  function playMove(index) {
    if (board[index] !== "") return false;
    board[index] = playerMarkers[currentPlayer]; // X or O
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    return true;
  }

  function getBoard() {
    return [...board];
  }

  function resetGame() {
    for (let i = 0; i < board.length; i++) board[i] = "";
    currentPlayer = "X";
  }

  function checkWinner() {
    const winCombinations = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    for (const combo of winCombinations) {
      const [a,b,c] = combo;
      if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // returns X or O
      }
    }

    if (board.every(cell => cell !== "")) return "draw";
    return null;
  }

  return { playMove, getBoard, resetGame, checkWinner, playerMarkers, currentPlayer: () => currentPlayer };
}

// DOM Elements
const game = createGame({ X: "X", O: "O" });
const cells = document.querySelectorAll(".cell");
const winnerDeclaration = document.querySelector(".result");
const resetBtn = document.getElementById("resetBtn");

const xScoreDiv = document.querySelector(".x-score");
const oScoreDiv = document.querySelector(".o-score");

const playerXInput = document.getElementById("playerX");
const playerOInput = document.getElementById("playerO");
const startGameBtn = document.getElementById("startGameBtn");

// Store player names
let playerNames = { X: "Player X", O: "Player O" };

// Score Tracking
let scores = { X: 0, O: 0 };
function updateScores() {
  xScoreDiv.querySelector(".score").textContent = scores.X;
  oScoreDiv.querySelector(".score").textContent = scores.O;
}

//Highlight Current Player
function highlightCurrentPlayer() {
  const current = game.currentPlayer();
  if (current === "X") {
    xScoreDiv.style.backgroundColor = "rgba(255,255,255,0.3)";
    oScoreDiv.style.backgroundColor = "transparent";
  } else {
    xScoreDiv.style.backgroundColor = "transparent";
    oScoreDiv.style.backgroundColor = "rgba(255,255,255,0.3)";
  }
}

// Start Game Button
startGameBtn.addEventListener("click", () => {
  playerNames.X = playerXInput.value.trim() || "Player X";
  playerNames.O = playerOInput.value.trim() || "Player O";

  // Update divs
  xScoreDiv.childNodes[0].nodeValue = `${playerNames.X}: `;
  oScoreDiv.childNodes[0].nodeValue = `${playerNames.O}: `;

  // Hide inputs
  document.querySelector(".player-names").style.display = "none";

  currentPlayer();
});

// board cells onclick
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    const success = game.playMove(index);
    if (!success) return;

    // Always X or O in board
    cell.textContent = game.getBoard()[index];

    const winner = game.checkWinner();
    if (winner) {
      if (winner === "draw") {
        winnerDeclaration.textContent = "DRAW!";
      } else {
        // Get winner name
        const winnerName = winner === "X" ? playerNames.X : playerNames.O;
        winnerDeclaration.textContent = `${winnerName} wins!`;

        // Increment scores
        const winnerKey = winner === "X" ? "X" : "O";
        scores[winnerKey]++;
        updateScores();
      }

      setTimeout(() => {
        game.resetGame();
        cells.forEach(c => (c.textContent = ""));
        winnerDeclaration.textContent = "";
        currentPlayer();
      }, 1500);
    }

    currentPlayer();
  });
});

// Reset button
resetBtn.addEventListener("click", () => {
  game.resetGame();
  cells.forEach(c => (c.textContent = ""));
  winnerDeclaration.textContent = "";
  highlightCurrentPlayer();

  // reset scores
  scores.X = 0;
  scores.O = 0;
  updateScores();
});