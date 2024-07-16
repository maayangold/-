let currentColor = "blue";
document.addEventListener('DOMContentLoaded', () => {
    const rows = 6;
    const cols = 7;
    const board = document.getElementById('board');
    let player = document.getElementById('player');
  
    player.textContent = `${currentColor}  התור של`;
        // Create the board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;

            // Add bottom-row class to the last row
            if (r === rows - 1) {
                cell.classList.add('bottom-row');
            }

            board.appendChild(cell);
        }
    }

    // Add event listener to handle cell clicks
    board.addEventListener('click', (e) => {
        if (e.target.classList.contains('cell')) {
            const col = e.target.dataset.col;
            addDisk(currentColor, col);
            currentColor = (currentColor === "blue") ? "red" : "blue";
            player.textContent = `${currentColor}  התור של`;

        }
    });

    function addDisk(color, column) {
        let row = rows - 1;
        let success = false;
        while (row >= 0 && !success) {
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${column}']`);
            if (cell.style.backgroundColor === '' || cell.style.backgroundColor === 'white') {
                cell.style.backgroundColor = color;
                success = true;
                
              isWin( row, column) 
            } else {
                row -= 1;
            }
        }

    }
});

function getRowVector(row, column) {
    let start = Math.max(0, column - 3);
    let end = Math.min(6, column + 3);
    let vector = [];
    
    for (let i = start; i <= end; i++) {
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${i}']`);
        vector.push(cell.style.backgroundColor );
    }
    console.log( vector);

    return vector;
}

function getColumnVector(row, column) {
    let start = Math.max(0, row - 3);
    let end = Math.min(5, row + 3);
    let vector = [];

    for (let i = start; i <= end; i++) {
        const cell = document.querySelector(`.cell[data-row='${i}'][data-col='${column}']`);
        vector.push(cell.style.backgroundColor );
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
        vector.push(cell.style.backgroundColor );
            r++;
        c++;
    }
    return vector;
}
////////////////dont work/////////////////
function getNegativeDiagonalVector(row, column) {
    let startRow = Math.max(0, row - 3);
    let startColumn = Math.max(0, column - 3);
    let endRow = Math.min(5, row + 3);
    let endColumn = Math.min(6, column + 3);
    let vector = [];

    let r = startRow;
    let c = endColumn;
    while (r <= endRow && c >= startColumn) {
        const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
        vector.push(cell.style.backgroundColor );
        r++;
        c--;
    }
    return vector;
}


function isWin( row, column) {
    let possibleVectors = [
        getRowVector(row, column),
        getColumnVector(row, column),
        getDiagonalVector(row, column),
        getNegativeDiagonalVector(row, column)
    ];

    for (let discsVector of possibleVectors) {
        if (fourSequenceExists(discsVector)) {
            let winnerColor = currentColor.toUpperCase();
            let overlayText = document.getElementById('overlay-text');
            let overlay = document.getElementById('overlay');
            overlayText.textContent = `Congratulations Player ${winnerColor}! You've won!`;
            overlay.style.display = 'flex';

            // הפעל את הסרטון האש על הרקע
            let video = document.getElementById('fireworks-video');
            video.play();

            // דיסבל ידנית את הכפתור העכבר
            board.removeEventListener('click', handleCellClick);
            return true; // ניצחון מצוין
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