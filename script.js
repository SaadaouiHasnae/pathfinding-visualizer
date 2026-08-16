const gridElement = document.getElementById("grid");
const runBfsButton = document.getElementById("run-bfs-button");
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


// Create all the cells in the grid
function createGrid() {
    gridElement.innerHTML = "";

    for (let row = 0; row < numberOfRows; row++) {
        for (let column = 0; column < numberOfColumns; column++) {
            const cell = document.createElement("div");

            cell.classList.add("cell");

            // Save the cell's position
            cell.dataset.row = row;
            cell.dataset.column = column;

            // Create the starting cell
            if (
                row === startPosition.row &&
                column === startPosition.column
            ) {
                cell.classList.add("start");
                cell.textContent = "S";
            }

            // Create the destination cell
            if (
                row === endPosition.row &&
                column === endPosition.column
            ) {
                cell.classList.add("end");
                cell.textContent = "E";
            }

            // Allow the user to create walls
            cell.addEventListener("click", handleCellClick);

            // Display the cell inside the grid
            gridElement.appendChild(cell);
        }
    }
}


// Add or remove a wall when a cell is clicked
function handleCellClick(event) {
    if (isRunning) {
        return;
    }

    const clickedCell = event.target;

    // Start and end cannot become walls
    if (
        clickedCell.classList.contains("start") ||
        clickedCell.classList.contains("end")
    ) {
        return;
    }

    clickedCell.classList.toggle("wall");
}


// Find a cell using its row and column
function getCell(row, column) {
    return document.querySelector(
        `[data-row="${row}"][data-column="${column}"]`
    );
}


// Turn coordinates into a string such as "7,3"
function createPositionKey(row, column) {
    return `${row},${column}`;
}


// Pause the animation
function sleep(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}


// Remove blue and yellow colors from an earlier search
function clearSearchColors() {
    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {
        cell.classList.remove("visited");
        cell.classList.remove("path");
    });
}


// Run the Breadth-First Search algorithm
async function runBFS() {
    if (isRunning) {
        return;
    }

    isRunning = true;
    clearSearchColors();

    // BFS stores positions waiting to be examined here
    const queue = [startPosition];

    // Remember positions already discovered
    const visited = new Set();

    // Remember where each position came from
    const parents = new Map();

    const startKey = createPositionKey(
        startPosition.row,
        startPosition.column
    );

    visited.add(startKey);

    // Four possible directions
    const directions = [
        [-1, 0], // Up
        [1, 0],  // Down
        [0, -1], // Left
        [0, 1]   // Right
    ];

    let foundDestination = false;

    while (queue.length > 0) {
        // Remove the first position from the queue
        const current = queue.shift();

        const currentCell = getCell(
            current.row,
            current.column
        );

        // Color the examined cell blue
        if (
            !currentCell.classList.contains("start") &&
            !currentCell.classList.contains("end")
        ) {
            currentCell.classList.add("visited");
            await sleep(25);
        }

        // Check whether BFS reached the destination
        if (
            current.row === endPosition.row &&
            current.column === endPosition.column
        ) {
            foundDestination = true;
            break;
        }

        // Check every neighboring cell
        for (const [rowChange, columnChange] of directions) {
            const nextRow = current.row + rowChange;
            const nextColumn = current.column + columnChange;

            const isInsideGrid =
                nextRow >= 0 &&
                nextRow < numberOfRows &&
                nextColumn >= 0 &&
                nextColumn < numberOfColumns;

            // Ignore positions outside the grid
            if (!isInsideGrid) {
                continue;
            }

            const nextCell = getCell(nextRow, nextColumn);

            const nextKey = createPositionKey(
                nextRow,
                nextColumn
            );

            // Ignore walls
            if (nextCell.classList.contains("wall")) {
                continue;
            }

            // Ignore positions already discovered
            if (visited.has(nextKey)) {
                continue;
            }

            visited.add(nextKey);

            const currentKey = createPositionKey(
                current.row,
                current.column
            );

            // Remember how BFS arrived at the next position
            parents.set(nextKey, currentKey);

            // Add the next position to the queue
            queue.push({
                row: nextRow,
                column: nextColumn
            });
        }
    }

    if (foundDestination) {
        await showShortestPath(parents);
    } else {
        alert("No path was found!");
    }

    isRunning = false;
}


// Reconstruct and display the shortest path
async function showShortestPath(parents) {
    const startKey = createPositionKey(
        startPosition.row,
        startPosition.column
    );

    let currentKey = createPositionKey(
        endPosition.row,
        endPosition.column
    );

    const path = [];

    // Travel backward from E to S
    while (currentKey !== startKey) {
        path.push(currentKey);
        currentKey = parents.get(currentKey);
    }

    // Reverse it so the animation goes from S to E
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


// Connect the buttons to their functions
runBfsButton.addEventListener("click", runBFS);

clearButton.addEventListener("click", () => {
    if (!isRunning) {
        createGrid();
    }
});


// Create the grid when the page loads
createGrid();