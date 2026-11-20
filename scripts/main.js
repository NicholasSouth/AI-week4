function Queue() {
  const queue = { items: [], head: 0 };
  return queue;
}

function enqueue(queue, node) {
  queue.items.push(node);
}

function dequeue(queue) {
  if (isEmpty(queue)) {
    return null;
  }
  const node = queue.items[queue.head];
  queue.head++;
  return node;
}

function isEmpty(queue) {
  return queue.head >= queue.items.length;
}

function Node(state, parent = null, action = null) {
  return { state: state, parent: parent, action: action };
}

function Problem(initialState, goalCondition, actions, result) {
  return {
    initialState: initialState,
    goalCondition: goalCondition,
    actions: actions,
    result: result
  };
}

function stateKey(state) {
  return state.flat().join(",");
}

function findBlank(state) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (state[row][col] === 0) {
        return [row, col];
      }
    }
  }
}

function puzzleActions(state) {
  const [row, col] = findBlank(state);
  const actions = [];
  if (row > 0) actions.push("UP");
  if (row < 2) actions.push("DOWN");
  if (col > 0) actions.push("LEFT");
  if (col < 2) actions.push("RIGHT");
  return actions;
}

function puzzleResult(state, action) {
  const [row, col] = findBlank(state);
  let newRow = row;
  let newCol = col;
  if (action === "UP") newRow = row - 1;
  else if (action === "DOWN") newRow = row + 1;
  else if (action === "LEFT") newCol = col - 1;
  else if (action === "RIGHT") newCol = col + 1;
  const grid = state.map(r => r.slice());
  grid[row][col] = grid[newRow][newCol];
  grid[newRow][newCol] = 0;
  return grid;
}

function isGoal(problem, state) {
  if (stateKey(state) === stateKey(problem.goalCondition)) {
    return true;
  } else {
    return false;
  }
}

function childNode(problem, parent, action) {
  const newState = problem.result(parent.state, action);
  return Node(newState, parent, action);
}

function solution(node) {
  const actions = [];
  while (node.parent !== null) {
    actions.push(node.action);
    node = node.parent;
  }
  actions.reverse();
  return actions;
}

function bfs(problem) {
  let node = Node(problem.initialState);
  if (isGoal(problem, node.state)) {
    return solution(node);
  }
  const frontier = Queue();
  enqueue(frontier, node);
  const inFrontier = new Set([stateKey(node.state)]);
  const explored = new Set();
  while (!isEmpty(frontier)) {
    node = dequeue(frontier);
    inFrontier.delete(stateKey(node.state));
    explored.add(stateKey(node.state));
    for (const action of problem.actions(node.state)) {
      const child = childNode(problem, node, action);
      const key = stateKey(child.state);
      if (!explored.has(key) && !inFrontier.has(key)) {
        if (isGoal(problem, child.state)) {
          return solution(child);
        }
        enqueue(frontier, child);
        inFrontier.add(key);
      }
    }
  }
  return null;
}

function isSolvable(initial, goal) {
  const goalTiles = goal.flat().filter(x => x !== 0);
  const rank = {};
  goalTiles.forEach((v, i) => { rank[v] = i; });
  const seq = initial.flat().filter(x => x !== 0).map(x => rank[x]);
  let inversions = 0;
  for (let i = 0; i < seq.length; i++) {
    for (let j = i + 1; j < seq.length; j++) {
      if (seq[i] > seq[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
}

function solvePuzzle(initial, goal) {
  const problem = Problem(initial, goal, puzzleActions, puzzleResult);
  const actions = bfs(problem);
  if (actions === null) return null;
  const steps = [];
  let totalCost = 0;
  let state = initial;
  actions.forEach((a, i) => {
    const [row, col] = findBlank(state);
    state = puzzleResult(state, a);
    const tile = state[row][col];
    totalCost += tile;
    steps.push({ step: i + 1, move: a, tile: tile, cost: tile, movedTo: [row, col], board: state });
  });
  return { steps: steps, numSteps: actions.length, totalCost: totalCost };
}

function validate(initial, goal) {
  for (const board of [initial, goal]) {
    for (const x of board.flat()) {
      if (!Number.isInteger(x) || x < 0) return "Every cell needs a whole number (0 or bigger).";
    }
    if (new Set(board.flat()).size !== 9) return "Numbers on a board must all be different.";
    if (board.flat().filter(x => x === 0).length !== 1) return "Each board must contain exactly one 0 (the blank).";
  }
  const a = initial.flat().slice().sort((x, y) => x - y).join(",");
  const b = goal.flat().slice().sort((x, y) => x - y).join(",");
  if (a !== b) return "Both boards must use the same numbers.";
  if (!isSolvable(initial, goal)) return "No solution: this goal cannot be reached from this start.";
  return null;
}

const initialDefault = [1, 2, 3, 4, 0, 6, 7, 5, 8];
const goalDefault    = [1, 2, 3, 4, 5, 6, 7, 8, 0];

function makeInputs(id, values) {
  const grid = document.getElementById(id);
  for (let i = 0; i < 9; i++) {
    const input = document.createElement("input");
    input.type = "number";
    input.min = 0;
    input.value = values[i];
    grid.appendChild(input);
  }
}

function readBoard(id) {
  const inputs = document.querySelectorAll("#" + id + " input");
  const board = [];
  for (let r = 0; r < 3; r++) {
    const row = [];
    for (let c = 0; c < 3; c++) {
      const text = inputs[r * 3 + c].value.trim();
      row.push(text === "" ? NaN : Number(text));
    }
    board.push(row);
  }
  return board;
}

function drawBoard(board, movedTo) {
  const grid = document.createElement("div");
  grid.className = "grid";
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = board[r][c];
      if (board[r][c] === 0) cell.classList.add("blank");
      if (movedTo && movedTo[0] === r && movedTo[1] === c) cell.classList.add("moved");
      grid.appendChild(cell);
    }
  }
  return grid;
}

function addStep(container, board, movedTo, html) {
  const div = document.createElement("div");
  div.className = "step";
  div.appendChild(drawBoard(board, movedTo));
  const caption = document.createElement("div");
  caption.className = "caption";
  caption.innerHTML = html;
  div.appendChild(caption);
  container.appendChild(div);
}

function onSolve() {
  const message = document.getElementById("message");
  const result = document.getElementById("result");
  result.style.display = "none";

  const initial = readBoard("initial");
  const goal = readBoard("goal");

  const error = validate(initial, goal);
  if (error) {
    message.textContent = error;
    return;
  }

  message.textContent = "Solving...";
  setTimeout(function () {
    const data = solvePuzzle(initial, goal);
    if (data === null) {
      message.textContent = "No solution found.";
      return;
    }
    message.textContent = "";
    document.getElementById("summary").innerHTML =
      "<b>Number of steps:</b> " + data.numSteps +
      " &nbsp;&nbsp; <b>Total cost:</b> " + data.totalCost;
    const steps = document.getElementById("steps");
    steps.innerHTML = "";
    addStep(steps, initial, null, "Start");
    for (const s of data.steps) {
      addStep(steps, s.board, s.movedTo,
        "Step " + s.step + ": tile " + s.tile + "<br>cost " + s.cost);
    }
    result.style.display = "block";
  }, 20);
}

makeInputs("initial", initialDefault);
makeInputs("goal", goalDefault);
