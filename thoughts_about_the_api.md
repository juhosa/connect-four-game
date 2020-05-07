# API for the game

For cleaner game play for the robot player.

Game state is something like

```javascript
state = {
    board: [the cells array],
    game_over: true/false, // after the move
    who_won: "blue"/"red"
}
```

## Expose

Functionality to

- Click a specific column (to add a button to it)
  - Get the game state as return value
  - If not valid move, false
- Start a new game
- Event to tell it's your turn?
