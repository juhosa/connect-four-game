/**
 * Try to find a winning move. If not found, try to find a blocking move.
 * If none found, insert randomly.
 */
class OptimisticlyAggressiveRobot1 extends Robot {
  constructor(color) {
    super(color);
  }

  play_turn() {
    let current_state = api.get_gamestate();
    // try all possible moves and see if i win
    let win_found = false;
    let col = -1;
    let enemy_color = this.color === "red" ? "blue" : "red";

    for (let i = 0; i < 7; i++) {
      let board = Array.from(current_state.board);
      let s = api.simulate_insert(board, i, this.color);

      if (s.game_over && s.who_won === this.color) {
        this.log(`Placing a button in col ${i} wins me this round!`);
        win_found = true;
        col = i;
        break;
      }
    }
    if (!win_found) {
      for (let i = 0; i < 7; i++) {
        let board = Array.from(current_state.board);
        let s = api.simulate_insert(board, i, enemy_color);

        if (s.game_over && s.who_won === enemy_color) {
          this.log(
            `Placing a button in col ${i} would result in enemy winning this round! BLOCK IT!`
          );
          win_found = true;
          col = i;
          break;
        }
      }
    }
    // place there if yes
    // if no win, select at random
    if (!win_found) {
      col = parseInt(Math.random() * COLS);
    }
    // play
    this.state = api.insert_button(col);
  }
}
