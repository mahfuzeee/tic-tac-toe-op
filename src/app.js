

(function(){

   // ---------- CORE STATE (single source of truth) ----------
   let boardState = [      // flat array representing 3x3 grid
         '', '', '',       // row 0: indices 0,1,2
         '', '', '',       // row 1: indices 3,4,5
         '', '', ''        // row 2: indices 6,7,8
   ];

   let currentPlayer = 'X';        // X always starts
   let gameActive = true;          // becomes false if win/draw
   let moveCount = 0;             // counts moves, helps to detect draw

   // DOM references
   const boardElement = document.getElementById('board');
   const statusMessageEl = document.getElementById('statusMessage');
   const currentPlayerSpan = document.getElementById('currentPlayerSpan');

   // ---------- WIN PATTERNS (all 8 lines) ----------
   const winPatterns = [
         [0, 1, 2], // top row
         [3, 4, 5], // middle row
         [6, 7, 8], // bottom row
         [0, 3, 6], // left column
         [1, 4, 7], // middle column
         [2, 5, 8], // right column
         [0, 4, 8], // main diagonal
         [2, 4, 6]  // anti-diagonal
   ];

   // ---------- RENDER BOARD based on boardState ----------
   function renderBoard() {
         // Clear board container, then rebuild cells from state
         boardElement.innerHTML = '';
         
         boardState.forEach((cellValue, index) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            // If cell is not empty, set data attribute and add disabled class
            if (cellValue !== '') {
               cell.setAttribute('data-value', cellValue);
               cell.classList.add('disabled');   // makes it non-clickable
               cell.textContent = cellValue;     // show X or O
            } else {
               // empty cell – no data-value, clickable (unless game inactive)
               cell.textContent = '';
               cell.removeAttribute('data-value');
               // if game paused/over, disable click; else enable
               if (!gameActive) {
                     cell.classList.add('disabled');
               } else {
                     cell.classList.remove('disabled');
               }
            }
            
            // Add click listener – will handle move if game active & cell empty
            cell.addEventListener('click', (event) => handleCellClick(index, event));
            
            boardElement.appendChild(cell);
         });
   }

   // ---------- HANDLE CELL CLICK (core game logic) ----------
   function handleCellClick(index, event) {
         // 1. validation: game active? cell already filled?
         if (!gameActive) return;
         if (boardState[index] !== '') return;   // spot taken

         // 2. commit move to boardState
         boardState[index] = currentPlayer;
         
         // 3. update UI cell: style, text, disable
         const clickedCell = event.currentTarget;
         clickedCell.textContent = currentPlayer;
         clickedCell.setAttribute('data-value', currentPlayer);
         clickedCell.classList.add('disabled');   // no double-click
         
         // 4. increment move counter
         moveCount++;

         // 5. Check win or draw immediately after move
         const winResult = checkWin(boardState, currentPlayer);
         
         if (winResult) {
            // WIN! 🏆
            gameActive = false;
            statusMessageEl.innerHTML = `✨ Player <span style="background:#3a6b5b; padding:6px 16px; border-radius:40px;">${currentPlayer}</span> wins! ✨`;
            disableAllCells();   // freeze board
         } else if (moveCount === 9) {
            // DRAW – board full, no winner
            gameActive = false;
            statusMessageEl.innerHTML = `🤝 It's a draw! 🤝`;
            disableAllCells();    // freeze board (already disabled? but ensure)
         } else {
            // 6. No win/draw: switch player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            currentPlayerSpan.textContent = currentPlayer;
            statusMessageEl.innerHTML = `🎮 Player <span id="currentPlayerSpan">${currentPlayer}</span>'s turn`;
         }
   }

   // ---------- CHECK WIN: returns true if currentPlayer has 3 in line ----------
   function checkWin(state, player) {
         // iterate over each winning combination
         for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (state[a] === player && state[b] === player && state[c] === player) {
               return true;   // winner found
            }
         }
         return false;          // no winner yet
   }

   // ---------- DISABLE ALL CELLS (game over) ----------
   function disableAllCells() {
         const cells = document.querySelectorAll('.cell');
         cells.forEach(cell => {
            cell.classList.add('disabled');
         });
   }

   // ---------- RESET GAME (fresh state) ----------
   function resetGame() {
         // 1. Reset state variables
         boardState = ['', '', '', '', '', '', '', '', ''];
         currentPlayer = 'X';
         gameActive = true;
         moveCount = 0;

         // 2. Update status message
         currentPlayerSpan.textContent = currentPlayer;
         statusMessageEl.innerHTML = `🎮 Player <span id="currentPlayerSpan">${currentPlayer}</span>'s turn`;

         // 3. Re-render board from fresh state
         renderBoard();
   }

   // ---------- INITIAL SETUP ----------
   function initGame() {
         // initial render of empty board
         renderBoard();
         
         // restart button listener
         const restartBtn = document.getElementById('restartButton');
         restartBtn.addEventListener('click', resetGame);
   }

   // start everything when DOM ready
   initGame();
})();