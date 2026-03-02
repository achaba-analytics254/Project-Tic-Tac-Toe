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

// Scores
let scores = { X: 0, O: 0 };
function updateScores() {
  xScoreDiv.querySelector(".score").textContent = scores.X;
  oScoreDiv.querySelector(".score").textContent = scores.O;
}

// Highlight Current Player
function currentPlayer() {
  const current = game.currentPlayer();
  if (current === "X") {
    xScoreDiv.style.backgroundColor = "rgba(255,255,255,0.3)";
    oScoreDiv.style.backgroundColor = "transparent";
  } else {
    xScoreDiv.style.backgroundColor = "transparent";
    oScoreDiv.style.backgroundColor = "rgba(255,255,255,0.3)";
  }
}

// Start game button
startGameBtn.addEventListener("click", () => {
  const nameX = playerXInput.value.trim() || "Player X";
  const nameO = playerOInput.value.trim() || "Player O";

  // Player names only for the score divs
  xScoreDiv.childNodes[0].nodeValue = `${nameX} `;
  oScoreDiv.childNodes[0].nodeValue = `${nameO} `;

  document.querySelector(".player-names").style.display = "none";
  currentPlayer();
});

// Board Cell Clicks
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    const success = game.playMove(index);
    if (!success) return;

    // X or O always shown
    cell.textContent = game.getBoard()[index];

    const winner = game.checkWinner();
    if (winner) {
      if (winner === "draw") {
        winnerDeclaration.textContent = "DRAW!";
      } else {
        // Display winner's name in result
        const winnerName = winner === "X" ? xScoreDiv.childNodes[0].nodeValue.slice(0, -2) 
                                          : oScoreDiv.childNodes[0].nodeValue.slice(0, -2);
        winnerDeclaration.textContent = `${winnerName} wins!`;

        // increment score
        const winnerKey = winner === "X" ? "X" : "O";
        scores[winnerKey]++;
        updateScores();
      }

      // setTimeout(() => {
      //   game.resetGame();
      //   cells.forEach(c => (c.textContent = ""));
      //   winnerDeclaration.textContent = "";
      //   currentPlayer();
      // }, 1500);
    }

    currentPlayer();
  });
});

// ---- Reset Button ----
resetBtn.addEventListener("click", () => {
  game.resetGame();
  cells.forEach(c => (c.textContent = ""));
  winnerDeclaration.textContent = "";
  currentPlayer();
});