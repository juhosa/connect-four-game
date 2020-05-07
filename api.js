const api = {
  insert_button: function (column_index) {
    cell_clicked(`cell_${column_index}`);
    return get_gamestate();
  },
  start_new_game: function () {
    new_game();
  },
};
