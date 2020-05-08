const api = {
  insert_button: function (column_index) {
    cell_clicked(`cell_${column_index}`);
    return get_gamestate();
  },
  start_new_game: function () {
    new_game();
  },
  get_gamestate: function () {
    return get_gamestate();
  },
  // check what happens if a button is
  // inserted at (param) board in the (param) column
  // returns gamestate or false if move not possible
  simulate_insert: function (board, column, player) {
    let last_empty_row_index = find_last_empty_row(get_column_values(column));

    if (last_empty_row_index === -1) {
      return false;
    }
    let index = last_empty_row_index * ROWS + last_empty_row_index + column;
    board[index] = player;

    // 0 = still going
    // 1 = board full
    // 2 = red won
    // 3 = blue won
    let s = check_board(board);

    return {
      board: board,
      game_over: s !== 0,
      who_won: s === 2 ? "red" : "blue",
    };
  },
};
