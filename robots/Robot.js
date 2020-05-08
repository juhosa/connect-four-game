class Robot {
  constructor(color) {
    this.color = color;
  }
  get_type() {
    return "robot";
  }

  play_turn() {
    throw new Error("Method 'play_turn' not implemented in class!");
  }
}
