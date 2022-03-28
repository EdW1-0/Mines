"use strict";

//let height = 10;
//let width = 10;
//let totalMines = 20;

// To stop the context menu firing when we right click a tile
// Credit: StackOverflow
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

document.getElementById('easy').onclick = easy;
document.getElementById('medium').onclick = medium;
document.getElementById('hard').onclick = hard;
document.getElementById('custom').onclick = custom;
// Used to populate with mines
// Credit: Javascript.info
function randomInteger(min, max) {
  // now rand is from  (min-0.5) to (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

document.getElementById('grid').ondragstart = function() { return false; };

class Smiley
{
  constructor() {
    this.smiley = document.getElementById("smiley");
  }

  smile() {
    this.smiley.src = 'smiley.png';
  }

  cool() {
    this.smiley.src = 'smiley_shades.png';
  }

  dead() {
    this.smiley.src = 'smiley_dead.png';
  }
}

// Work to be done by this class:
// Set up a new game when clicked (clearing up previous if necessary)
// Keep track of win/lose, total mines left
class Game
{
  static game = null;
  static makeGame(x, y, mines)
  {
    if (this.game)
      this.game.stop();
    this.game = new this(x, y, mines);
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
      if (tile.cleared && tile.mine)
      {
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
}


class Tile
{
  constructor(grid, x, y) {
    this.mine = false;
    this.cleared = false;
    this.flag = false;
    this.grid = grid;
    this.x = x;
    this.y = y;
  }

  north() {return this.grid.tileAt(this.x, this.y-1);}
  northWest() {return this.grid.tileAt(this.x-1, this.y-1);}
  west() {return this.grid.tileAt(this.x-1, this.y);}
  southWest() {return this.grid.tileAt(this.x-1, this.y+1);}
  south() {return this.grid.tileAt(this.x, this.y+1);}
  southEast() {return this.grid.tileAt(this.x+1, this.y+1);}
  east() {return this.grid.tileAt(this.x+1, this.y);}
  northEast() {return this.grid.tileAt(this.x+1, this.y-1);}

//TODO: should this return array with nulls in for boundaries?
  neighbours() {
    let neighbours = [];
    neighbours.push(this.north());
    neighbours.push(this.northWest());
    neighbours.push(this.west());
    neighbours.push(this.southWest());
    neighbours.push(this.south());
    neighbours.push(this.southEast());
    neighbours.push(this.east());
    neighbours.push(this.northEast());
    return neighbours;
  }

// TODO: DRY - could merge these into "propCount" method taking prop name as arg.
  neighbourMineCount() {
    let mines = 0;
    for (let i of this.neighbours()) {
      if (i) {
        mines += i.mine;
      }
    }
    return mines
  }

  neighbourFlagCount() {
    let flags = 0;
    for (let i of this.neighbours()) {
      if (i) {
        flags += i.flag;
      }
    }
    return flags;
  }

  mouseDown(event) {
      if (event.button == 2) {
        if (!this.cleared) {
          if (this.flag) {
            this.flag = false;
            // TODO: This should be internal to grid
            this.grid.remainingMines++;
            this.grid.updateMineCounter();
          } else {
            this.flag = true;
            this.grid.remainingMines--;
            this.grid.updateMineCounter();
          }
        }
      }

      this.grid.renderTile(this.x,this.y);
    }


  mouseUp(event) {
    // TODO: Pull most of this business logic into descriptively named functions
    if (event.button == 0) {
      if (!this.flag) {
        this.cleared = true;
        if (!this.grid.mined) {
          this.grid.generateMines();
        }
        // Fast clear if clicked on a zero
        if (this.cleared && !this.mine && this.neighbourMineCount() == 0) {
          for (let neighbour of this.neighbours()) {
            if (neighbour && !neighbour.cleared && !neighbour.flag) {
              neighbour.mouseUp(event);
            }
          }
        }
      }
    } else if (event.button == 1) {
      let mines = this.neighbourMineCount();
      let flags = this.neighbourFlagCount();
      if (this.cleared && (mines == flags)) {
        for (let neighbour of this.neighbours()) {
          if (neighbour && !neighbour.cleared) {
            let spoofEvent = {};
            Object.assign(spoofEvent, event);
            spoofEvent.button = 0;
            neighbour.mouseUp(spoofEvent);
          }
        }
      }
    }




      this.grid.renderTile(this.x,this.y);

      // TODO: Put these in game and use bubbling
      if (Game.game.checkLose())
      Game.game.lose();

      if (Game.game.checkWin())
      Game.game.win();

  }
}

class Grid
{
  constructor(width, height, totalMines) {
    this.tiles = new Set();
    this.width = width;
    this.height = height;
    this.totalMines = totalMines;
    this.table = document.getElementById('grid');
    this.mineCounter = document.getElementById('mineCounter');

  }

  add (tile) {
    this.tiles.add(tile);
  }
  tileAt(x,y) {
    let foundTile = null;
    for (let tile of this.tiles) {
      if (tile.x == x && tile.y == y)
      {
        foundTile = tile;
        break;
      }
    }
    return foundTile;
  }
  cellAt(x,y) {
    return this.table.rows[y].cells[x];
  }

  generateTiles() {
    let table = document.getElementById('grid');
    this.table.innerHTML = null;

    for (let i=0; i < this.height; i++)
    {
      let tr = document.createElement('tr');
      this.table.append(tr);
      for (let j=0; j<this.width; j++)
      {
        let tile = new Tile(this, j, i);
        this.add(tile);

        let td = document.createElement('td');
        let img = document.createElement('img');
        td.append(img);

        let boundDown = tile.mouseDown.bind(tile);
        let boundUp = tile.mouseUp.bind(tile);
        td.onmousedown = boundDown;
        td.onmouseup = boundUp;
        td.ondragstart = function() { return false; };
        tr.append(td);
      }
    }

    for (let i = 0; i < this.height; i++)
    {
      for (let j = 0; j < this.width; j++)
      {
        this.renderTile(j,i);
      }
    }
  }

  generateMines() {
    for (let i = 0; i < this.totalMines; i++) {
      if (this.totalMines >= this.width * this.height)
        alert ("Too many mines!");
      let tile = null;
      do {
        let x = randomInteger(0, this.width-1);
        let y = randomInteger(0, this.height-1);
        tile = this.tileAt(x,y);
      } while (tile.mine || tile.cleared)
      tile.mine = true;
    }
    this.mined = true;
    this.remainingMines = this.totalMines;
    this.updateMineCounter();
  }

// TODO: Surely could achieve this through a custom setter.
  updateMineCounter()
  {
    mineCounter.textContent = this.remainingMines;
  }
 // TODO: Could clean this up. No need to create new img tags, just set src on
 // each and be done. Image paths could be stored in a map - single place to change to
 // change file paths
  renderTile(x, y) {
    let html = null;

    let tile = this.tileAt(x, y);
    if (tile.flag) {
    html = "flag.png";
  } else if (!tile.cleared) {
    if (tile.highlight)
      html = 'highlight.png'
    else
      html = 'hidden.png'
  }else if (tile.mine){
    html = 'mine.png'
  }else {
      let mines = tile.neighbourMineCount();
      switch (mines) {
        case 0:
        html = 'zero.png'
        break;
        case 1:
        html = 'one.png'
        break;
        case 2:
        html = 'two.png'
        break;
        case 3:
        html = 'three.png'
        break;
        case 4:
        html = 'four.png'
        break;
        case 5:
        html = 'five.png'
        break;
        case 6:
        html = 'six.png'
        break;
        case 7:
        html = 'seven.png'
        break;
        case 8:
        html = 'eight.png'
        break;
        default:
        alert("Your switch is broken")
        html = 'seychelles.png'
        break;
      }
    }

    let cell = this.cellAt(x,y);
    cell.firstChild.src = html;
  }

}

//grid.generateMines(totalMines);
//game = new Game(width, height, totalMines);

//TODO: Make these class methods on Game
function easy()
{
  Game.makeGame(9, 9, 10);
}

function medium()
{
  Game.makeGame(16, 16, 40);
}

function hard()
{
  Game.makeGame(30, 16, 99);
}

function custom()
{
  let height = document.getElementById("height").value;
  let width = document.getElementById("width").value;
  let mines = document.getElementById("mines").value;

  alert(height);
  Game.makeGame(width, height, mines);
}
