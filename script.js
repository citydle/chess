const board = Chessboard('board', 'start');
const game = new Chess();
let time = 300; // 5 minutes in seconds
let increment = 5; // 5 seconds increment
let timerInterval;
let botDifficulty = 1;

// Timer function
function updateTimer() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  document.getElementById('timer').innerText = Time: ${minutes}:${seconds.toString().padStart(2, '0')};
  if (time <= 0) {
    clearInterval(timerInterval);
    alert("Time's up!");
  }
  time--;
}

// Start the timer
document.getElementById('difficulty').addEventListener('change', (e) => {
  botDifficulty = parseInt(e.target.value);
});

// Make a move for the bot
function makeBotMove() {
  const moves = game.moves();
  if (moves.length > 0) {
    const move = moves[Math.floor(Math.random() * moves.length)]; // Random move for simplicity
    game.move(move);
    board.position(game.fen());
    if (game.in_checkmate()) {
      document.getElementById('status').innerText = 'Checkmate! You lost.';
    } else if (game.in_check()) {
      document.getElementById('status').innerText = 'Check!';
    }
  }
}

// Handle user moves
board.onDrop = (source, target) => {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q', // Always promote to queen for simplicity
  });

  if (move === null) return 'snapback';

  if (game.in_checkmate()) {
    document.getElementById('status').innerText = 'Checkmate! You won.';
  } else if (game.in_check()) {
    document.getElementById('status').innerText = 'Check!';
  }

  setTimeout(makeBotMove, 500); // Bot responds after 500ms
};

// Initialize the game
function initGame() {
  game.reset();
  board.start();
  time = 300;
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

initGame();
