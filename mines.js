"use strict";

import Smiley from './smiley.js'
import Grid from './grid.js'


// Work to be done by this class:
// Set up a new game when clicked (clearing up previous if necessary)
// Keep track of win/lose, total mines left
class Game
{
  static game = null;
  static {
    document.getElementById('easy').onclick = this.easy;
    document.getElementById('medium').onclick = this.medium;
    document.getElementById('hard').onclick = this.hard;
    document.getElementById('custom').onclick = this.custom;
  }

  static makeGame(x, y, mines)
  {
    if (this.game)
      this.game.stop();
    this.game = new this(x, y, mines);
  }

  static easy()
  {
    Game.makeGame(9, 9, 10);
  }
  static medium()
  {
    Game.makeGame(16, 16, 40);
  }
  static hard()
  {
    Game.makeGame(30, 16, 99);
  }
  static custom()
  {
    let height = document.getElementById("height").value;
    let width = document.getElementById("width").value;
    let mines = document.getElementById("mines").value;

    Game.makeGame(width, height, mines);
  }

  constructor(width, height, totalMines) {
    this.grid = new Grid(width, height, totalMines);
    this.grid.generateTiles();
    this.state = "Running";

    this.time = 0;
    this.updateTimer();
    let boundIncrement = this.incrementTime.bind(this);
    this.timerId = setInterval(boundIncrement, 1000);

    this.smiley = new Smiley();
    this.smiley.smile();

    // TODO: Done here to catch the win/lose checks, but consider if this either
    // belongs to grid or else should be on higher object (div? document?)
    document.getElementById("grid").onmouseup = this.mouseUp.bind(this);
  }

  incrementTime()
  {
    this.time++;
    this.updateTimer();
  }
  updateTimer()
  {
    document.getElementById('timer').textContent = this.time;
  }

  win()
  {
    alert("You win!");
    this.stop();
    this.smiley.cool();
  }
  lose()
  {
    alert("You lose!");
    this.stop();
    this.smiley.dead();
  }
  stop()
  {
    clearInterval(this.timerId);
  }

// Win condition:
// All non-mined tiles cleared.
// No mined tiles cleared.
  checkWin()
  {
    for (let tile of this.grid.tiles) {
      if (tile.cleared && tile.mine) {
        return false;
      } else if (!tile.cleared && !tile.mine) {
        return false;
      }
    }
    return true;
  }

// Lose condition:
// There exists at least one tile which is mined and cleared.
  checkLose()
  {
    for (let tile of this.grid.tiles) {
      if (tile.cleared && tile.mine)
        return true;
    }
    return false;
  }

  mouseUp(event) {
    if (this.checkLose())
      this.lose();

    if (this.checkWin())
      this.win();
  }
}