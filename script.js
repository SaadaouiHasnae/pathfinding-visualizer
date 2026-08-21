const gridElement = document.getElementById("grid");

const runBfsButton = document.getElementById("run-bfs-button");
const runDfsButton = document.getElementById("run-dfs-button");
const runDijkstraButton = document.getElementById(
    "run-dijkstra-button"
);

const drawModeButton = document.getElementById("draw-mode-button");
const clearButton = document.getElementById("clear-button");

const algorithmStat = document.getElementById("algorithm-stat");
const visitedStat = document.getElementById("visited-stat");
const pathStat = document.getElementById("path-stat");
const costStat = document.getElementById("cost-stat");
const timeStat = document.getElementById("time-stat");

const numberOfRows = 15;
const numberOfColumns = 20;

const startPosition = { row: 7, column: 3 };
const endPosition = { row: 7, column: 16 };

let isRunning = false;
let drawMode = "wall";


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

    const cell = event.target;

    if (
        cell.classList.contains("start") ||
        cell.classList.contains("end")
    ) {
        return;
    }

    if (drawMode === "wall") {
        cell.classList.remove("weight");
        cell.classList.toggle("wall");
    } else {
        cell.classList.remove("wall");
        cell.classList.toggle("weight");
    }
}


function toggleDrawMode() {
    if (isRunning) {
        return;
    }

    if (drawMode === "wall") {
        drawMode = "weight";
        drawModeButton.textContent = "Mode: Weights";
        drawModeButton.classList.add("weight-mode");
    } else {
        drawMode = "wall";
        drawModeButton.textContent = "Mode: Walls";
        drawModeButton.classList.remove("weight-mode");
    }
}


function getCell(row, column) {
    return document.querySelector(
        `[data-row="${row}"][data-column="${column}"]`
    );
}


function createPositionKey(row, column) {
    return `${row},${column}`;
}


function getCellCost(row, column) {
    const cell = getCell(row, column);

    if (cell.classList.contains("weight")) {
        return 5;
    }

    return 1;
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
    costStat.textContent = "0";
    timeStat.textContent = "0 ms";
}


function updateStatistics(
    algorithm,
    visitedCells,
    pathLength,
    pathCost,
    executionTime
) {
    algorithmStat.textContent = algorithm;
    visitedStat.textContent = visitedCells;
    pathStat.textContent = pathLength;
    costStat.textContent = pathCost;
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
        const row = current.row + rowChange;
        const column = current.column + columnChange;

        const isInsideGrid =
            row >= 0 &&
            row < numberOfRows &&
            column >= 0 &&
            column < numberOfColumns;

        if (!isInsideGrid) {
            continue;
        }

        const cell = getCell(row, column);

        if (cell.classList.contains("wall")) {
            continue;
        }

        neighbors.push({ row, column });
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

        for (const neighbor of getNeighbors(current)) {
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

    return {
        foundDestination,
        parents,
        visitedOrder,
        executionTime: performance.now() - startTime
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

        for (const neighbor of getNeighbors(current)) {
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

    return {
        foundDestination,
        parents,
        visitedOrder,
        executionTime: performance.now() - startTime
    };
}


function calculateDijkstra() {
    const priorityQueue = [
        {
            row: startPosition.row,
            column: startPosition.column,
            distance: 0
        }
    ];

    const distances = new Map();
    const parents = new Map();
    const visited = new Set();
    const visitedOrder = [];

    const startKey = createPositionKey(
        startPosition.row,
        startPosition.column
    );

    distances.set(startKey, 0);

    const startTime = performance.now();
    let foundDestination = false;

    while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => {
            return a.distance - b.distance;
        });

        const current = priorityQueue.shift();

        const currentKey = createPositionKey(
            current.row,
            current.column
        );

        if (visited.has(currentKey)) {
            continue;
        }

        visited.add(currentKey);
        visitedOrder.push(current);

        if (
            current.row === endPosition.row &&
            current.column === endPosition.column
        ) {
            foundDestination = true;
            break;
        }

        for (const neighbor of getNeighbors(current)) {
            const neighborKey = createPositionKey(
                neighbor.row,
                neighbor.column
            );

            if (visited.has(neighborKey)) {
                continue;
            }

            const movementCost = getCellCost(
                neighbor.row,
                neighbor.column
            );

            const newDistance =
                current.distance + movementCost;

            const oldDistance =
                distances.get(neighborKey) ?? Infinity;

            if (newDistance < oldDistance) {
                distances.set(neighborKey, newDistance);
                parents.set(neighborKey, currentKey);

                priorityQueue.push({
                    row: neighbor.row,
                    column: neighbor.column,
                    distance: newDistance
                });
            }
        }
    }

    return {
        foundDestination,
        parents,
        visitedOrder,
        executionTime: performance.now() - startTime
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


function calculatePathCost(path) {
    let totalCost = 0;

    for (const key of path) {
        const [row, column] = key.split(",").map(Number);
        totalCost += getCellCost(row, column);
    }

    return totalCost;
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

    let result;

    if (algorithmName === "BFS") {
        result = calculateBFS();
    } else if (algorithmName === "DFS") {
        result = calculateDFS();
    } else {
        result = calculateDijkstra();
    }

    await animateVisitedCells(result.visitedOrder);

    let pathLength = 0;
    let pathCost = 0;

    if (result.foundDestination) {
        const path = reconstructPath(result.parents);

        pathLength = path.length;
        pathCost = calculatePathCost(path);

        await animatePath(path);
    } else {
        alert("No path was found!");
    }

    updateStatistics(
        algorithmName,
        result.visitedOrder.length,
        pathLength,
        pathCost,
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

runDijkstraButton.addEventListener("click", () => {
    runAlgorithm("Dijkstra");
});

drawModeButton.addEventListener("click", toggleDrawMode);

clearButton.addEventListener("click", () => {
    if (!isRunning) {
        createGrid();
    }
});


createGrid();