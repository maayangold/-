document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const player1 = urlParams.get('player1');
    const player2 = urlParams.get('player2');
    const isComputerPlayer = (player2 === 'המחשב');
    let currentColor = "red";
    const fallMusic = document.getElementById('fall');
    const endMusic = document.getElementById('end');
    let currentPlayer = document.getElementById('player');
    currentPlayer.textContent = `התור של ${player1}`;
    const rows = 6;
    const cols = 7;
    const board = document.getElementById('board');

    // Create the board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            if (r === rows - 1) {
                cell.classList.add('bottom-row');
            }

            board.appendChild(cell);
        }
    }
    
    function updatePlayer() {
        currentColor = (currentColor === "yellow") ? "red" : "yellow";
        currentPlayer.textContent = `התור של ${currentColor === "red" ? player1 : player2}`;

        if (currentColor === "red") {
            currentPlayer.classList.remove(`player2`);
            currentPlayer.classList.add(`player1`);
        } else {
            currentPlayer.classList.remove("player1");
            currentPlayer.classList.add("player2");
        }
    }

    // Add event listener to handle cell clicks
    board.addEventListener('click', (e) => {
        if (e.target.classList.contains('cell')) {
            const col = e.target.dataset.col;
            // Checking if success to add disk

            if (addDisk(currentColor, col)) {
                if (!isComputerPlayer || currentColor === "red") {
                    updatePlayer();
                }
                if (isComputerPlayer && currentColor === "yellow") {
                    setTimeout(computerAddDisk, 1500); // המתנה קצרה לפני הוספת הדיסק של המחשב
                }
            }
        }
    });

    function addDisk(color, column) {
        let row = rows - 1;
        let success = false;
        while (row >= 0 && !success) {
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${column}']`);
            if (cell.style.backgroundColor === '' || cell.style.backgroundColor === 'white') {
                fallMusic.play();
                cell.style.backgroundColor = color;
                success = true;
                if (isWin(row, column)) {
                    return false;
                }
            } else {
                row -= 1;
            }
        }
        return success;
    }
    //תור לשחקןמחשב
    function computerAddDisk() {
        let col;
        let success = false;
        while (!success) {
            col = Math.floor(Math.random() * cols);
            success = addDisk(currentColor, col);
        }
        updatePlayer();
    }
    function getRowVector(row, column) {
        let start = Math.max(0, column - 3);
        let end = Math.min(6, column + 3);
        let vector = [];

        for (let i = start; i <= end; i++) {
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${i}']`);
            vector.push(cell.style.backgroundColor);
        }
        return vector;
    }

    function getColumnVector(row, column) {
        let start = Math.max(0, row - 3);
        let end = Math.min(5, row + 3);
        let vector = [];

        for (let i = start; i <= end; i++) {
            const cell = document.querySelector(`.cell[data-row='${i}'][data-col='${column}']`);
            vector.push(cell.style.backgroundColor);
        }
        return vector;
    }

    function getDiagonalVector(row, column) {
        let startRow = Math.max(0, row - 3);
        let startColumn = Math.max(0, column - 3);
        let endRow = Math.min(5, row + 3);
        let endColumn = Math.min(6, column + 3);
        let vector = [];

        let r = startRow;
        let c = startColumn;
        while (r <= endRow && c <= endColumn) {
            const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
            vector.push(cell.style.backgroundColor);
            r++;
            c++;
        }
        return vector;
    }

    function getNegativeDiagonalVector(row, column) {
        let startRow = Math.max(0, row - 3);
        let startColumn = Math.max(0, column - 3);
        let endRow = Math.min(5, row + 3);
        let endColumn = Math.min(6, column + 3);
        let vector = [];
        //
        let r = startRow;
        let c = endColumn;
        while (r <= endRow && c >= startColumn) {
            const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
            console.log(r, c)

            vector.push(cell.style.backgroundColor);
            r++;
            c--;
        }
        return vector;
    }

    function isWin(row, column) {
        let possibleVectors = [
            getRowVector(row, column),
            getColumnVector(row, column),
            getDiagonalVector(row, column),
            getNegativeDiagonalVector(row, column)
        ];

        for (let discsVector of possibleVectors) {
            if (fourSequenceExists(discsVector)) {
                endMusic.play();
                let winner = currentColor === "red" ? player1 : player2;
                let overlay = document.getElementById('overlay');
                let winnerElement = document.getElementById('winner');
                winnerElement.textContent = winner;
                overlay.classList.add('show');

                // Disable the board
                document.getElementById('board').style.pointerEvents = 'none';
                document.body.style.opacity = '0.5';

                return true; // Victory
            }
        }

        return false;
    }

    function fourSequenceExists(vector) {
        let currentCount = 0;
        let lastColor = null;

        for (let color of vector) {
            if (color !== "" && color === lastColor) {
                currentCount++;
                if (currentCount >= 4) {
                    return true;
                }
            } else {
                lastColor = color;
                currentCount = 1;
            }
        }

        return false;
    }
});
