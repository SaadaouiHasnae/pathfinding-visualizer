const gridElement = document.getElementById("grid");
const runBfsButton = document.getElementById("run-bfs-button");
const runDfsButton = document.getElementById("run-dfs-button");
const clearButton = document.getElementById("clear-button");

const numberOfRows = 15;
const numberOfColumns = 20;

const startPosition = {
    row: 7,
    column: 3
};

const endPosition = {
    row: 7,
    column: 16
};

let isRunning = false;


// Create the grid
function createGrid() {
    gridElement.innerHTML = "";

    for (let row = 0; row < numberOfRows; row++) {
        for (let column = 0; column < numberOfColumns; column++) {
            const cell = document.createElement("div");

            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.column = column;

            if (
                row === startPosition.row &&
                column === startPosition.column
            ) {
                cell.classList.add("start");
                cell.textContent = "S";
            }

            if (
                row === endPosition.row &&
                column === endPosition.column
            ) {
                cell.classList.add("end");
                cell.textContent = "E";
            }

            cell.addEventListener("click", handleCellClick);
            gridElement.appendChild(cell);
        }
    }
}


// Add or remove walls
function handleCellClick(event) {
    if (isRunning) {
        return;
    }

    const clickedCell = event.target;

    if (
        clickedCell.classList.contains("start") ||
        clickedCell.classList.contains("end")
    ) {
        return;
    }

    clickedCell.classList.toggle("wall");
}


// Find a cell by its coordinates
function getCell(row, column) {
    return document.querySelector(
        `[data-row="${row}"][data-column="${column}"]`
    );
}


// Create a unique string for a position
function createPositionKey(row, column) {
    return `${row},${column}`;
}


// Pause during an animation
function sleep(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}


// Remove previous search colors
function clearSearchColors() {
    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {
        cell.classList.remove("visited");
        cell.classList.remove("path");
    });
}


// Color one visited cell
async function showVisitedCell(position) {
    const cell = getCell(position.row, position.column);

    if (
        !cell.classList.contains("start") &&
        !cell.classList.contains("end")
    ) {
        cell.classList.add("visited");
        await sleep(25);
    }
}


// Run Breadth-First Search
async function runBFS() {
    if (isRunning) {
        return;
    }

    isRunning = true;
    clearSearchColors();

    const queue = [startPosition];
    const visited = new Set();
    const parents = new Map();

    const startKey = createPositionKey(
        startPosition.row,
        startPosition.column
    );

    visited.add(startKey);

    const directions = [
        [-1, 0], // Up
        [1, 0],  // Down
        [0, -1], // Left
        [0, 1]   // Right
    ];

    let foundDestination = false;

    while (queue.length > 0) {
        // BFS removes the first item
        const current = queue.shift();

        await showVisitedCell(current);

        if (
            current.row === endPosition.row &&
            current.column === endPosition.column
        ) {
            foundDestination = true;
            break;
        }

        for (const [rowChange, columnChange] of directions) {
            const nextRow = current.row + rowChange;
            const nextColumn = current.column + columnChange;

            const isInsideGrid =
                nextRow >= 0 &&
                nextRow < numberOfRows &&
                nextColumn >= 0 &&
                nextColumn < numberOfColumns;

            if (!isInsideGrid) {
                continue;
            }

            const nextCell = getCell(nextRow, nextColumn);
            const nextKey = createPositionKey(
                nextRow,
                nextColumn
            );

            if (nextCell.classList.contains("wall")) {
                continue;
            }

            if (visited.has(nextKey)) {
                continue;
            }

            visited.add(nextKey);

            const currentKey = createPositionKey(
                current.row,
                current.column
            );

            parents.set(nextKey, currentKey);

            queue.push({
                row: nextRow,
                column: nextColumn
            });
        }
    }

    if (foundDestination) {
        await showPath(parents);
    } else {
        alert("No path was found!");
    }

    isRunning = false;
}


// Run Depth-First Search
async function runDFS() {
    if (isRunning) {
        return;
    }

    isRunning = true;
    clearSearchColors();

    const stack = [startPosition];
    const visited = new Set();
    const parents = new Map();

    const startKey = createPositionKey(
        startPosition.row,
        startPosition.column
    );

    visited.add(startKey);

    const directions = [
        [0, 1],  // Right
        [0, -1], // Left
        [1, 0],  // Down
        [-1, 0]  // Up
    ];

    let foundDestination = false;

    while (stack.length > 0) {
        // DFS removes the last item
        const current = stack.pop();

        await showVisitedCell(current);

        if (
            current.row === endPosition.row &&
            current.column === endPosition.column
        ) {
            foundDestination = true;
            break;
        }

        for (const [rowChange, columnChange] of directions) {
            const nextRow = current.row + rowChange;
            const nextColumn = current.column + columnChange;

            const isInsideGrid =
                nextRow >= 0 &&
                nextRow < numberOfRows &&
                nextColumn >= 0 &&
                nextColumn < numberOfColumns;

            if (!isInsideGrid) {
                continue;
            }

            const nextCell = getCell(nextRow, nextColumn);
            const nextKey = createPositionKey(
                nextRow,
                nextColumn
            );

            if (nextCell.classList.contains("wall")) {
                continue;
            }

            if (visited.has(nextKey)) {
                continue;
            }

            visited.add(nextKey);

            const currentKey = createPositionKey(
                current.row,
                current.column
            );

            parents.set(nextKey, currentKey);

            stack.push({
                row: nextRow,
                column: nextColumn
            });
        }
    }

    if (foundDestination) {
        await showPath(parents);
    } else {
        alert("No path was found!");
    }

    isRunning = false;
}


// Reconstruct and display the discovered path
async function showPath(parents) {
    const startKey = createPositionKey(
        startPosition.row,
        startPosition.column
    );

    let currentKey = createPositionKey(
        endPosition.row,
        endPosition.column
    );

    const path = [];

    // Follow the parent cells backward from E to S
    while (currentKey !== startKey) {
        path.push(currentKey);
        currentKey = parents.get(currentKey);
    }

    // Display the path from S toward E
    path.reverse();

    for (const key of path) {
        const [row, column] = key.split(",").map(Number);
        const cell = getCell(row, column);

        if (
            !cell.classList.contains("start") &&
            !cell.classList.contains("end")
        ) {
            cell.classList.remove("visited");
            cell.classList.add("path");

            await sleep(40);
        }
    }
}


// Connect the buttons
runBfsButton.addEventListener("click", runBFS);
runDfsButton.addEventListener("click", runDFS);

clearButton.addEventListener("click", () => {
    if (!isRunning) {
        createGrid();
    }
});


// Create the grid when the page loads
createGrid();