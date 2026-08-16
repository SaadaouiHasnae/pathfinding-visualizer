# Pathfinding Visualizer

An interactive pathfinding visualizer built with HTML, CSS, and vanilla JavaScript. It demonstrates how Breadth-First Search (BFS) explores a grid and finds the shortest path between two points.

## Live Demo

[Open the Pathfinding Visualizer](https://saadaouihasnae.github.io/pathfinding-visualizer/)

## Features

- Interactive grid
- Start and destination nodes
- Clickable walls and obstacles
- Animated BFS exploration
- Shortest-path visualization
- Clear-grid control

## Color Guide

- Green: starting position
- Red: destination
- Dark: wall or obstacle
- Blue: cell visited by BFS
- Yellow: shortest path

## How to Use

1. Click empty grid cells to create walls.
2. Click a wall again to remove it.
3. Press **Run BFS** to start the visualization.
4. Watch BFS explore the grid in blue.
5. The shortest path is displayed in yellow.
6. Press **Clear Grid** to reset the board.

## How BFS Works

Breadth-First Search explores the nearest available cells first. It stores cells waiting to be explored in a queue and tracks previously visited cells to avoid processing them twice.

On an unweighted grid, BFS guarantees the shortest path when one exists.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- GitHub Pages

## Run Locally

Clone the repository:

```bash
git clone https://github.com/SaadaouiHasnae/pathfinding-visualizer.git
```

Enter the project directory:

```bash
cd pathfinding-visualizer
```

Open `index.html` directly, or start a local server:

```bash
py -m http.server 8000
```

Then visit `http://localhost:8000`.

## Planned Improvements

- Depth-First Search
- Dijkstra’s algorithm
- A\* search
- Weighted cells
- Adjustable animation speed
- Algorithm statistics and comparisons
- Random maze generation

## Author

Created by [Saadaoui Hasnae](https://github.com/SaadaouiHasnae).
