document.addEventListener('DOMContentLoaded', () => {
  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let gameActive = true;
  
  let gameMode = 'vsComputer';
  let difficulty = 'hard';
  
  let scores = { X: 0, O: 0, draw: 0 };
  
  const cells = document.querySelectorAll('.cell');
  const gameStatus = document.getElementById('game-status');
  const playerXScore = document.getElementById('playerX-score');
  const playerOScore = document.getElementById('playerO-score');
  const drawScore = document.getElementById('draw-score');
  const restartBtn = document.getElementById('restart-btn');
  const newGameBtn = document.getElementById('new-game-btn');
  
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  function initCustomDropdowns() {
    const modeSelected = document.getElementById('mode-selected');
    const modeOptions = document.getElementById('mode-options');
    const modeDropdown = modeSelected.parentElement;
    
    const difficultySelected = document.getElementById('difficulty-selected');
    const difficultyOptions = document.getElementById('difficulty-options');
    const difficultyDropdown = difficultySelected.parentElement;
    
    modeSelected.addEventListener('click', () => {
      modeDropdown.classList.toggle('active');
      difficultyDropdown.classList.remove('active');
    });
    
    difficultySelected.addEventListener('click', () => {
      if (!difficultyDropdown.classList.contains('disabled')) {
        difficultyDropdown.classList.toggle('active');
        modeDropdown.classList.remove('active');
      }
    });
    
    modeOptions.addEventListener('click', (e) => {
      if (e.target.classList.contains('dropdown-option')) {
        const value = e.target.getAttribute('data-value');
        const text = e.target.textContent;
        modeSelected.querySelector('span').textContent = text;
        modeOptions.querySelectorAll('.dropdown-option').forEach(opt => opt.classList.remove('selected'));
        e.target.classList.add('selected');
        gameMode = value;
        modeDropdown.classList.remove('active');
        toggleDifficulty();
        initGame();
      }
    });
    
    difficultyOptions.addEventListener('click', (e) => {
      if (e.target.classList.contains('dropdown-option')) {
        const value = e.target.getAttribute('data-value');
        const text = e.target.textContent;
        difficultySelected.querySelector('span').textContent = text;
        difficultyOptions.querySelectorAll('.dropdown-option').forEach(opt => opt.classList.remove('selected'));
        e.target.classList.add('selected');
        difficulty = value;
        difficultyDropdown.classList.remove('active');
        initGame();
      }
    });
    
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-dropdown')) {
        modeDropdown.classList.remove('active');
        difficultyDropdown.classList.remove('active');
      }
    });
    
    modeOptions.querySelector('[data-value="vsComputer"]').classList.add('selected');
    difficultyOptions.querySelector('[data-value="hard"]').classList.add('selected');
  }
  
  function toggleDifficulty() {
    const difficultyDropdown = document.getElementById('difficulty-dropdown');
    if (gameMode === 'twoPlayer') {
      difficultyDropdown.classList.add('disabled');
    } else {
      difficultyDropdown.classList.remove('disabled');
    }
  }

  initCustomDropdowns();
  initGame();
  
  function initGame() {
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('x', 'o', 'winning-cell');
      cell.style.pointerEvents = 'auto';
    });
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    gameStatus.textContent = `Player ${currentPlayer}'s Turn`;
    gameStatus.style.background = '#3498db';
    toggleDifficulty();
  }
  
  function handleCellClick(e) {
    if (!gameActive) return;
    if (gameMode === 'vsComputer' && currentPlayer === 'O') {
      return;
    }
    
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));
    
    if (board[index] !== '') return;
    
    makeMove(index);
    
    if (gameActive && gameMode === 'vsComputer' && currentPlayer === 'O') {
      setTimeout(makeComputerMove, 600);
    }
  }
  
  function makeMove(index) {
    board[index] = currentPlayer;
    const cell = cells[index];
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.style.pointerEvents = 'none';
    
    if (checkWin()) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      gameStatus.textContent = `Player ${currentPlayer}'s Turn`;
    }
  }
  
  function makeComputerMove() {
    if (!gameActive) return;
    let move = -1;
    if (difficulty === 'easy') {
      move = findRandomMove();
    } else if (difficulty === 'medium') {
      move = findWinningMove('O');
      if (move === -1) move = findWinningMove('X');
      if (move === -1) move = findRandomMove();
    } else if (difficulty === 'hard') {
      move = findBestMove();
    }
    if (move !== -1) {
      makeMove(move);
    }
  }
  
  function findWinningMove(player) {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] === player && board[b] === player && board[c] === '') return c;
      if (board[a] === player && board[c] === player && board[b] === '') return b;
      if (board[b] === player && board[c] === player && board[a] === '') return a;
    }
    return -1;
  }
  
  function findRandomMove() {
    const availableMoves = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') availableMoves.push(i);
    }
    return availableMoves.length > 0 
      ? availableMoves[Math.floor(Math.random() * availableMoves.length)] 
      : -1;
  }
  
  function checkWin() {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        cells[a].classList.add('winning-cell');
        cells[b].classList.add('winning-cell');
        cells[c].classList.add('winning-cell');
        return true;
      }
    }
    return false;
  }
  
  function isDraw() {
    return !board.includes('');
  }
  
  function endGame(isDrawFlag) {
    gameActive = false;
    cells.forEach(cell => cell.style.pointerEvents = 'none');
    if (isDrawFlag) {
      gameStatus.textContent = "Game ended in a draw!";
      gameStatus.style.background = '#9b59b6';
      scores.draw++;
      drawScore.textContent = scores.draw;
    } else {
      gameStatus.textContent = `Player ${currentPlayer} wins!`;
      gameStatus.style.background = currentPlayer === 'X' ? '#e74c3c' : '#2ecc71';
      scores[currentPlayer]++;
      if (currentPlayer === 'X') {
        playerXScore.textContent = scores.X;
      } else {
        playerOScore.textContent = scores.O;
      }
    }
  }
  
  function findBestMove() {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, 0, false);
        board[i] = '';
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function minimax(boardState, depth, isMaximizing) {
    const scoresMap = { O: 10, X: -10, draw: 0 };
    const result = checkWinner(boardState);
    if (result !== null) {
      return scoresMap[result];
    }
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === '') {
          boardState[i] = 'O';
          let evalScore = minimax(boardState, depth + 1, false);
          boardState[i] = '';
          maxEval = Math.max(maxEval, evalScore);
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === '') {
          boardState[i] = 'X';
          let evalScore = minimax(boardState, depth + 1, true);
          boardState[i] = '';
          minEval = Math.min(minEval, evalScore);
        }
      }
      return minEval;
    }
  }
  
  function checkWinner(bd) {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) {
        return bd[a];
      }
    }
    return bd.includes('') ? null : 'draw';
  }
  
  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  
  restartBtn.addEventListener('click', initGame);
  
  newGameBtn.addEventListener('click', () => {
    scores = { X: 0, O: 0, draw: 0 };
    playerXScore.textContent = '0';
    playerOScore.textContent = '0';
    drawScore.textContent = '0';
    initGame();
  });
});
