let board, game;

$(document).ready(function () {
  board = Chessboard('board', 'start');
  game = new Chess();

  $('#startBtn').on('click', startGame);
  $('#resetBtn').on('click', resetGame);
});

function startGame() {
  game.reset();
  board.start();
  makeBotMove();
}

function resetGame() {
  game.reset();
  board.start();
  $('#status').text('Game in progress');
}

function makeBotMove() {
  if (game.game_over()) {
    $('#status').text('Game over! ' + (game.in_checkmate() ? 'Checkmate!' : 'Draw!'));
    return;
  }

  if (game.turn() === 'b') {
    const difficulty = parseInt($('#difficulty').val());
    const stockfish = new Worker('https://cdn.jsdelivr.net/npm/stockfish.js@0.11.0/stockfish.min.js');
    stockfish.postMessage('uci');
    stockfish.postMessage(setoption name Skill Level value ${difficulty});
    stockfish.postMessage('position fen ' + game.fen());
    stockfish.postMessage('go depth 10');

    stockfish.onmessage = function (event) {
      if (event.data.startsWith('bestmove')) {
        const move = event.data.split(' ')[1];
        game.move(move);
        board.position(game.fen());
        stockfish.terminate();
        if (game.in_check()) $('#status').text('Check!');
        if (game.in_checkmate()) $('#status').text('Checkmate! You lost.');
      }
    };
  }
}

$('#board').on('dragStart', function (source, piece) {
  if (game.game_over() || game.turn() !== 'w' || piece.search(/^b/) !== -1) return false;
});

$('#board').on('drop', function (source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';
  board.position(game.fen());
  if (game.in_check()) $('#status').text('Check!');
  if (game.in_checkmate()) $('#status').text('Checkmate! You won.');
  setTimeout(makeBotMove, 500);
});
