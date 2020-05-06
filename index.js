let cells = [];
const COLS = 7;
const ROWS = 6;

let player = "red";
let game_over = false;

let games = 0;
let wins_red = 0;
let wins_blue = 0;

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
  if (game_over) {
    return;
  }
  let id = index.split("_")[1];
  //   console.log(`cell with id ${index} clicked. (Column ${id})`);

  let col_vals = get_column_values(parseInt(id));
  //   console.log(col_vals);

  let last_empty_row_index = find_last_empty_row(col_vals);
  //   console.log(last_empty_row_index);

  if (last_empty_row_index === -1) {
    return;
  }

  toggle_cell_color(last_empty_row_index, parseInt(id));

  // change player
  player = player === "red" ? "blue" : "red";

  // check board
  // 0 = still going
  // 1 = board full
  // 2 = red won
  // 3 = blue won
  let is_over = check_board();
  console.log(`Is the game over: ${is_over}`);
  if (is_over !== 0) {
    game_over = true;
    if (is_over === 1) {
      setMessage("Board full!");
    } else if (is_over === 2) {
      setMessage("Red won!");
      wins_red++;
    } else if (is_over === 3) {
      setMessage("Blue won!");
      wins_blue++;
    }
    games++;
  }

  updateUI();
}

function setMessage(msg) {
  document.querySelector("#message").innerText = msg;
}

function updateUI() {
  document.querySelector("#player_span").innerText = player;

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

function check_board() {
  console.log("checking the board...");

  // 0 = still going
  // 1 = board full
  // 2 = red won
  // 3 = blue won
  let board_state = 0;
  let empty_found = false;
  // loop cells
  for (let i = 0; i < cells.length; i++) {
    // if empty, pass
    if (cells[i] === "empty") {
      empty_found = true;
      continue;
    }

    let val = cells[i];
    let c_index = Math.floor(i % COLS);
    let r_index = Math.floor(i / COLS);
    // console.log(`index: ${i}, r: ${r_index}, c: ${c_index}, val: ${val}`);

    let connection_found = false;
    // diagonal checks

    // the possible diagonals are limited
    if (c_index < 4 && r_index < 3) {
      // the next index is always 8 away (ie. 0, 8, 16, 24)
      connection_found = isFourConnected(i, COLS + 1);
    }

    if (c_index < 4 && r_index > 2 && !connection_found) {
      // the previous index is always 6 behind (ie. 35, 29, 23, 17)
      connection_found = isFourConnected(i, -(COLS - 1));
    }

    // check only 3 of the top rows for vertical connections
    if (r_index < 3 && !connection_found) {
      // different row, same columns is always COLS away
      connection_found = isFourConnected(i, COLS);
    }

    // check only the first 4 columns for horizontal connections
    if (c_index < 4 && !connection_found) {
      // the next index is always one away
      connection_found = isFourConnected(i, 1);
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

function isFourConnected(index, change) {
  let vals = [];

  while (vals.length < 4) {
    let v = cells[index];
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

function init() {
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
  //   cells[21] = "red";
  //   cells[28] = "red";
  //   cells[35] = "red";
  create_board();
  updateUI();

  // attach event handlers
  document.querySelector("#newgame_btn").addEventListener("click", new_game);
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
