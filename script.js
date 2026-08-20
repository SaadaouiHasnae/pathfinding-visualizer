const gridElement = document.getElementById("grid");
const runBfsButton = document.getElementById("run-bfs-button");
const runDfsButton = document.getElementById("run-dfs-button");
const clearButton = document.getElementById("clear-button");

const algorithmStat = document.getElementById("algorithm-stat");
const visitedStat = document.getElementById("visited-stat");
const pathStat = document.getElementById("path-stat");
const timeStat = document.getElementById("time-stat");

const numberOfRows = 15;
const numberOfColumns = 20;

const startPosition = { row: 7, column: 3 };
const endPosition = { row: 7, column: 16 };

let isRunning = false;


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

    resetStatistics();
}


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


function getCell(row, column) {
    return document.querySelector(
        `[data-row="${row}"][data-column="${column}"]`
    );
}


function createPositionKey(row, column) {
    return `${row},${column}`;
}


function sleep(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}


function clearSearchColors() {
    const cells = document.querySelectorAll(".cell");

    cells.forEach(cell => {
        cell.classList.remove("visited");
        cell.classList.remove("path");
    });
}


function resetStatistics() {
    algorithmStat.textContent = "—";
    visitedStat.textContent = "0";
    pathStat.textContent = "0";
    timeStat.textContent = "0 ms";
}


function updateStatistics(
    algorithm,
    visitedCells,
    pathLength,
    executionTime
) {
    algorithmStat.textContent = algorithm;
    visitedStat.textContent = visitedCells;
    pathStat.textContent = pathLength;
    timeStat.textContent = `${executionTime.toFixed(3)} ms`;
}


function getNeighbors(current) {
    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ];

    const neighbors = [];

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

        const cell = getCell(nextRow, nextColumn);

        if (cell.classList.contains("wall")) {
            continue;
        }

        neighbors.push({
            row: nextRow,
            column: nextColumn
        });
    }

    return neighbors;
}


function calculateBFS() {
    const queue = [startPosition];
    const visited = new Set();
    const parents = new Map();
    const visitedOrder = [];

    const startKey = createPositionKey(
        startPosition.row,
        startPosition.column
    );

    visited.add(startKey);

    const startTime = performance.now();
    let foundDestination = false;

    while (queue.length > 0) {
        const current = queue.shift();

        visitedOrder.push(current);

        if (
            current.row === endPosition.row &&
            current.column === endPosition.column
        ) {
            foundDestination = true;
            break;
        }

        const neighbors = getNeighbors(current);

        for (const neighbor of neighbors) {
            const neighborKey = createPositionKey(
                neighbor.row,
                neighbor.column
            );

            if (visited.has(neighborKey)) {
                continue;
            }

            visited.add(neighborKey);

            const currentKey = createPositionKey(
                current.row,
                current.column
            );

            parents.set(neighborKey, currentKey);
            queue.push(neighbor);
        }
    }

    const executionTime = performance.now() - startTime;

    return {
        foundDestination,
        parents,
        visitedOrder,
        executionTime
    };
}


function calculateDFS() {
    const stack = [startPosition];
    const visited = new Set();
    const parents = new Map();
    const visitedOrder = [];

    const startKey = createPositionKey(
        startPosition.row,
        startPosition.column
    );

    visited.add(startKey);

    const startTime = performance.now();
    let foundDestination = false;

    while (stack.length > 0) {
        const current = stack.pop();

        visitedOrder.push(current);

        if (
            current.row === endPosition.row &&
            current.column === endPosition.column
        ) {
            foundDestination = true;
            break;
        }

        const neighbors = getNeighbors(current);

        for (const neighbor of neighbors) {
            const neighborKey = createPositionKey(
                neighbor.row,
                neighbor.column
            );

            if (visited.has(neighborKey)) {
                continue;
            }

            visited.add(neighborKey);

            const currentKey = createPositionKey(
                current.row,
                current.column
            );

            parents.set(neighborKey, currentKey);
            stack.push(neighbor);
        }
    }

    const executionTime = performance.now() - startTime;

    return {
        foundDestination,
        parents,
        visitedOrder,
        executionTime
    };
}


async function animateVisitedCells(visitedOrder) {
    for (const position of visitedOrder) {
        const cell = getCell(position.row, position.column);

        if (
            !cell.classList.contains("start") &&
            !cell.classList.contains("end")
        ) {
            cell.classList.add("visited");
            await sleep(25);
        }
    }
}


function reconstructPath(parents) {
    const startKey = createPositionKey(
        startPosition.row,
        startPosition.column
    );

    let currentKey = createPositionKey(
        endPosition.row,
        endPosition.column
    );

    const path = [];

    while (currentKey !== startKey) {
        path.push(currentKey);
        currentKey = parents.get(currentKey);
    }

    path.reverse();

    return path;
}


async function animatePath(path) {
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


async function runAlgorithm(algorithmName) {
    if (isRunning) {
        return;
    }

    isRunning = true;
    clearSearchColors();
    resetStatistics();

    const result =
        algorithmName === "BFS"
            ? calculateBFS()
            : calculateDFS();

    await animateVisitedCells(result.visitedOrder);

    let pathLength = 0;

    if (result.foundDestination) {
        const path = reconstructPath(result.parents);

        pathLength = path.length;

        await animatePath(path);
    } else {
        alert("No path was found!");
    }

    updateStatistics(
        algorithmName,
        result.visitedOrder.length,
        pathLength,
        result.executionTime
    );

    isRunning = false;
}


runBfsButton.addEventListener("click", () => {
    runAlgorithm("BFS");
});

runDfsButton.addEventListener("click", () => {
    runAlgorithm("DFS");
});

clearButton.addEventListener("click", () => {
    if (!isRunning) {
        createGrid();
    }
});


createGrid();