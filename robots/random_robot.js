class RandomRobot extends Robot {
  constructor(color) {
    super(color);
  }

  play_turn() {
    // if this.state is not undefined, maybe do something with it
    // do intelligent stuffsies
    let r = parseInt(Math.random() * COLS);

    // play
    this.state = api.insert_button(r);
  }
}
