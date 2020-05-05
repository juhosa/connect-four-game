let cells = [];
const COLS = 7;
const ROWS = 6;

function get_column_values(c_index) {
  let tmp = [];
  for (let i = 0; i < ROWS; i++) {
    tmp.push(cells[i * COLS + c_index]);
  }
  return tmp;
}

function cell_clicked(index) {
  let id = index.split("_")[1];
  console.log(`cell with id ${index} clicked. (Column ${id})`);

  let col_vals = get_column_values(parseInt(id));
  console.log(col_vals);

  // find index of the last empty row
  last_empty = ROWS - 1;
  for (let i = 0; i < col_vals.length; i++) {
    if (col_vals[i] !== "empty") {
      last_empty = i - 1;
      break;
    }
  }
  console.log(last_empty);

  document.querySelector(`#${index}`).dataset.color = "red";
}

function toggle_cell_color(r, c) {}

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
  cells = [];
  for (let i = 0; i < ROWS * COLS; i++) {
    let c = "empty";
    cells.push(c);
  }
  //   cells[21] = "red";
  //   cells[28] = "red";
  //   cells[35] = "red";
  create_board();
}

init();
