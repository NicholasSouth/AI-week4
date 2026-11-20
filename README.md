# 8-Puzzle Solver (BFS)

A small website that solves the 8-puzzle with Breadth-First Search (BFS).
It runs in the browser, so no installation is needed.

## How to run

Download the whole directory into your end device and open `index.html` in a web browser.

Or play it directly through this link: https://nicholassouth.github.io/AI-week4/

## How to use

1. Type the numbers of the **initial board** and the **goal board** (3x3 each).
2. Use `0` for the blank cell. Every number on a board must be different.
3. Click **Solve**.

The page shows:

- the number of steps
- the total cost
- the board after every step (the tile that moved is highlighted)

## Rules

- A move slides one tile into the blank cell.
- The cost of a move is the **number written on the tile** that moves.
- Total cost = the sum of the costs of all moves.
- Both boards must use the same numbers.
- If the goal cannot be reached from the start, the page shows a message.

## Files

| File | Purpose |
|---|---|
| `index.html` | The page |
| `styles/main.css` | The look (dark pink theme, colors are CSS variables) |
| `scripts/main.js` | The BFS algorithm and the page logic |

## How BFS works here

The code in `scripts/main.js` follows the lecture pseudocode:

1. Start with the initial state in the **Frontier** (a FIFO queue).
2. Take the first node out of the Frontier and add its state to **Explored**.
3. Make a child node for every legal move of the blank.
4. If a child is not in Explored or the Frontier, check it:
   - if it is the goal, return the path of moves
   - otherwise add it to the end of the Frontier
5. If the Frontier becomes empty, there is no solution.

Main functions: `Queue`, `enqueue`, `dequeue`, `isEmpty`, `Node`, `Problem`,
`isGoal`, `childNode`, `solution`, `bfs`.

BFS finds the path with the **fewest steps**. This is not always the path with
the lowest total cost, because the cost depends on the tile numbers.
