let cells = [];
const COLS = 7;
const ROWS = 6;

let player = "red";
let game_over = false;

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
  }

  updateUI();
}

function updateUI() {
  document.querySelector("#player_span").innerText = player;
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
    // check only 3 of the top rows for vertical connections
    if (r_index < 3) {
      connection_found = isFourConnectedVertically(val, i);
      if (connection_found) {
        if (val === "red") {
          return 2;
        } else {
          return 3;
        }
      }
    }

    // check only the first 4 columns for horizontal connections
    if (c_index < 4) {
      connection_found = isFourConnectedHorizontally(val, i);
      if (connection_found) {
        if (val === "red") {
          return 2;
        } else {
          return 3;
        }
      }
    }
  }

  if (!empty_found) {
    board_state = 1;
  }
  return board_state;
}

function isFourConnectedHorizontally(val, index) {
  // get the three next values from the same line
  let vals = [];
  vals.push(val);
  for (let i = index + 1; i < index + 4; i++) {
    vals.push(cells[i]);
  }

  // check if the values are the same
  let valsSet = new Set(vals);
  return valsSet.size === 1;
}

function isFourConnectedVertically(val, index) {
  // get the three next values from the same column
  let vals = [];
  vals.push(val);
  for (let i = index + COLS; i < index + 4 * COLS; i += COLS) {
    vals.push(cells[i]);
  }
  console.log(vals);

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

    if (i >= 0 && i <= ROWS) {
      d.addEventListener("click", (e) => {
        // console.dir(e.target.id);
        cell_clicked(e.target.id);
      });
    }

    let t = document.createTextNode(i);
    d.appendChild(t);

    board.appendChild(d);
  }
}

function init() {
  game_over = false;
  player = "red";

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
}

init();
