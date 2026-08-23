# Pathfinding Visualizer

An interactive pathfinding algorithm visualizer built with HTML, CSS, and vanilla JavaScript. It demonstrates how different search algorithms explore a grid and choose a path between two points.

## Live Demo

[Open the Pathfinding Visualizer](https://saadaouihasnae.github.io/pathfinding-visualizer/)

## Preview

![Pathfinding Visualizer demo](assets/pathfinding-demo.png)

## Features

- Breadth-First Search
- Depth-First Search
- Dijkstra’s algorithm
- A\* Search
- Interactive walls
- Weighted cells
- Movable start and destination nodes
- Adjustable animation speed
- Clear Path and Clear Grid controls
- Visited-cell count
- Path length and path cost
- Algorithm execution time
- Responsive layout

## Algorithms

| Algorithm | Weighted cells |   Guarantees optimal path? | Search strategy                                   |
| --------- | -------------: | -------------------------: | ------------------------------------------------- |
| BFS       |             No | Yes, on an unweighted grid | Explores level by level                           |
| DFS       |             No |                         No | Explores deeply before backtracking               |
| Dijkstra  |            Yes |                        Yes | Prioritizes the lowest accumulated cost           |
| A\*       |            Yes |                        Yes | Combines accumulated cost with estimated distance |

## Color Guide

- Green: starting position
- Red: destination
- Dark blue: wall
- Purple: weighted cell with cost 5
- Blue: visited cell
- Yellow: discovered path
- White: normal cell with cost 1

## How to Use

1. Select wall mode and click cells to create obstacles.
2. Switch to weight mode to create weighted cells.
3. Click the start or destination node, then click another cell to move it.
4. Select an animation speed.
5. Run BFS, DFS, Dijkstra, or A\*.
6. Review the resulting path and statistics.
7. Use **Clear Path** to preserve the grid layout or **Clear Grid** to reset everything.

## How It Works

The grid is represented as a graph. Every cell is a node, and its adjacent cells are its neighbors.

BFS uses a queue, while DFS uses a stack. Dijkstra prioritizes the lowest accumulated path cost. A\* combines that cost with Manhattan distance to estimate how close each cell is to the destination.

Parent references are stored during each search and used to reconstruct the final path.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Git and GitHub
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

Start a local server:

```bash
py -m http.server 8000
```

Visit:

```text
http://localhost:8000
```

## Future Improvement

- Random maze generation
- Side-by-side algorithm comparison
- Dark mode
