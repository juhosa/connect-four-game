const COLS = 7;
const ROWS = 6;
const BOT_DELAY = 50;

let cells = [];

let game_started = false;
let game_over = false;

let player = "red";
let last_winner = "";

let games = 0;
let wins_red = 0;
let wins_blue = 0;
let ties = 0;

let player1 = undefined;
let player2 = undefined;

function get_column_values(c_index) {
  let tmp = [];
  for (let i = 0; i < ROWS; i++) {
    tmp.push(cells[i * COLS + c_index]);
  }
  return tmp;
}

function find_last_empty_row(col_vals) {
  // find index of the last empty row
  let last_empty = ROWS - 1;
  for (let i = 0; i < col_vals.length; i++) {
    if (col_vals[i] !== "empty") {
      last_empty = i - 1;
      break;
    }
  }
  return last_empty;
}

function cell_clicked(index) {
  if (game_over || !game_started) {
    return;
  }
  let col = parseInt(index.split("_")[1]);
  //   console.log(`cell with id ${index} clicked. (Column ${id})`);

  let last_empty_row_index = find_last_empty_row(get_column_values(col));

  if (last_empty_row_index === -1) {
    nextPlayer();
    return;
  }

  toggle_cell_color(last_empty_row_index, col);

  // check board
  // 0 = still going
  // 1 = board full
  // 2 = red won
  // 3 = blue won
  let is_over = check_board(cells);
  // console.log(`Is the game over: ${is_over}`);
  if (is_over !== 0) {
    game_over = true;
    if (is_over === 1) {
      setMessage("Board full!");
      ties++;
    } else if (is_over === 2) {
      setMessage("Red won!");
      last_winner = player;
      wins_red++;
    } else if (is_over === 3) {
      setMessage("Blue won!");
      last_winner = player;
      wins_blue++;
    }
    games++;

    if (player1.get_type() === "robot") {
      new_game();
      setTimeout(() => player1.play_turn(), BOT_DELAY);
      updateUI();
      return;
    }
  }

  nextPlayer();
  updateUI();
}

function nextPlayer() {
  // change player
  player = player === "red" ? "blue" : "red";

  if (player === "red" && player1.get_type() === "robot") {
    setTimeout(() => player1.play_turn(), BOT_DELAY);
    // console.log("p1");
  }

  // blue is always player2
  if (player === "blue" && player2.get_type() === "robot") {
    setTimeout(() => player2.play_turn(), BOT_DELAY);
    // console.log("p2");
  }
}

function setMessage(msg) {
  document.querySelector("#message").innerText = msg;
}

function updateUI() {
  document.querySelector("#player_span").innerText = player;

  document.querySelector("#ties").innerText = ties;

  let red_percentage = 0;
  let blue_percentage = 0;

  if (games > 0) {
    red_percentage = (wins_red / games) * 100;
    blue_percentage = (wins_blue / games) * 100;
  }

  document.querySelector(
    "#wins_red"
  ).innerText = `${wins_red}/${games} (${parseInt(red_percentage)}%)`;
  document.querySelector(
    "#wins_blue"
  ).innerText = `${wins_blue}/${games} (${parseInt(blue_percentage)}%)`;
}

function check_board(board) {
  // console.log("checking the board...");

  // 0 = still going
  // 1 = board full
  // 2 = red won
  // 3 = blue won
  let board_state = 0;
  let empty_found = false;
  // loop cells
  for (let i = 0; i < board.length; i++) {
    // if empty, pass
    if (board[i] === "empty") {
      empty_found = true;
      continue;
    }

    let val = board[i];
    let c_index = Math.floor(i % COLS);
    let r_index = Math.floor(i / COLS);
    // console.log(`index: ${i}, r: ${r_index}, c: ${c_index}, val: ${val}`);

    let connection_found = false;
    // diagonal checks

    // the possible diagonals are limited
    if (c_index < 4 && r_index < 3) {
      // the next index is always 8 away (ie. 0, 8, 16, 24)
      connection_found = isFourConnected(board, i, COLS + 1);
    }

    if (c_index < 4 && r_index > 2 && !connection_found) {
      // the previous index is always 6 behind (ie. 35, 29, 23, 17)
      connection_found = isFourConnected(board, i, -(COLS - 1));
    }

    // check only 3 of the top rows for vertical connections
    if (r_index < 3 && !connection_found) {
      // different row, same columns is always COLS away
      connection_found = isFourConnected(board, i, COLS);
    }

    // check only the first 4 columns for horizontal connections
    if (c_index < 4 && !connection_found) {
      // the next index is always one away
      connection_found = isFourConnected(board, i, 1);
    }
    if (connection_found) {
      if (val === "red") {
        return 2;
      } else {
        return 3;
      }
    }
  }

  if (!empty_found) {
    board_state = 1;
  }
  return board_state;
}

function isFourConnected(board, index, change) {
  let vals = [];

  while (vals.length < 4) {
    let v = board[index];
    vals.push(v);
    index += change;
  }

  // check if the values are the same
  let valsSet = new Set(vals);
  return valsSet.size === 1;
}

function toggle_cell_color(r, c) {
  // change the element dataset
  let index = r * ROWS + r + c;
  //   console.log(`r: ${r}, c: ${c}, index: ${index}`);

  document.querySelector(`#cell_${index}`).dataset.color = player;

  // change the value in cells-array
  cells[index] = player;
}

function create_board() {
  let board = document.querySelector("#board");

  let n = ROWS * COLS;

  for (let i = 0; i < cells.length; i++) {
    let d = document.createElement("div");
    d.setAttribute("class", "cell");
    d.setAttribute("id", `cell_${i}`);
    d.setAttribute("data-color", cells[i]);

    if (i >= 0 && i < COLS) {
      d.setAttribute("data-toprow", "true");
      d.addEventListener("click", (e) => {
        // console.dir(e.target.id);
        cell_clicked(e.target.id);
      });
    }

    // let t = document.createTextNode(i);
    // d.appendChild(t);

    board.appendChild(d);
  }
}

function get_gamestate() {
  return {
    board: cells,
    game_over: game_over,
    who_won: last_winner,
  };
}

function init() {
  console.log("Initializing");
  game_over = false;
  setMessage("");
  player = "red";
  games = 0;
  wins_red = 0;
  wins_blue = 0;

  cells = [];
  for (let i = 0; i < ROWS * COLS; i++) {
    let c = "empty";
    cells.push(c);
  }

  create_board();
  updateUI();

  // attach event handlers
  document
    .querySelector("#newgame_btn")
    .addEventListener("click", () => new_game());

  document
    .querySelector("#play_random_robot_btn")
    .addEventListener("click", () => player2.play_turn());

  document.querySelector("#start_btn").addEventListener("click", () => start());
  document.querySelector("#pause_btn").addEventListener("click", () => pause());
}

function pause() {
  game_over = !game_over;
}

function start() {
  console.log("start");

  let p1 = document.querySelector("#p1").selectedOptions[0].value;
  let p2 = document.querySelector("#p2").selectedOptions[0].value;

  let players_map = {
    human: Human,
    random_robot: RandomRobot,
    optimistic_robot_1: OptimisticRobot1,
    aggressive_robot_1: AggressiveRobot1,
    optimisticly_aggressive_robot_1: OptimisticlyAggressiveRobot1,
  };

  player1 = new players_map[p1]("red");
  player2 = new players_map[p2]("blue");
  game_started = true;

  // if player1 is a bot, start the game
  if (player1.get_type() === "robot") {
    console.log("rooot");
    player1.play_turn();
  }
}

function new_game() {
  console.log("Starting new game");
  game_over = false;
  setMessage("");
  player = "red";

  document.querySelector("#board").innerHTML = "";

  cells = [];
  for (let i = 0; i < ROWS * COLS; i++) {
    let c = "empty";
    cells.push(c);
  }
  create_board();
  updateUI();
}

init();
