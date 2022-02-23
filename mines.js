"use strict";

//let height = 10;
//let width = 10;
//let totalMines = 20;

let game = null;
// To stop the context menu firing when we right click a tile
// Credit: StackOverflow
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

document.getElementById('easy').onclick = easy;
document.getElementById('medium').onclick = medium;
document.getElementById('hard').onclick = hard;
// Used to populate with mines
// Credit: Javascript.info
function randomInteger(min, max) {
  // now rand is from  (min-0.5) to (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}


// Implements state machine
// States:
// Idle, Running, Lost, Won
// Work to be done by this class:
// Set up a new game when clicked (clearing up previous if necessary)
// Keep track of win/lose, total mines left
class Game
{
  constructor(width, height, totalMines) {
    this.grid = new Grid(width, height, totalMines);
    this.grid.generateTiles();
    this.state = "Running";
  }

  win()
  {
    alert("You win!");
  }
  lose()
  {
    alert("You lose!");
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

  neighbourCount() {
    let mines = 0;
    for (let i of this.neighbours()) {
      if (i) {
        mines += i.mine;
      }
    }
    return mines
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

        td.innerHTML = this.renderTile(j,i);
        td.onmousedown = tileMouseDown;
        td.onmouseup = tileMouseUp;
        tr.append(td);
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

  renderTile(x, y) {
    let html = null;

    let tile = this.tileAt(x, y);
    if (tile.flag) {
    html = "<img src='flag.png'></img>"
  } else if (!tile.cleared) {
    html = "<img src='hidden.png'></img>"
  }else if (tile.mine){
    html = "<img src='mine.png'></img>"
  }else {
      let mines = tile.neighbourCount();
      switch (mines) {
        case 0:
        html = "<img src='zero.png'></img>";
        break;
        case 1:
        html = "<img src='one.png'></img>";
        break;
        case 2:
        html = "<img src='two.png'></img>";
        break;
        case 3:
        html = "<img src='three.png'></img>";
        break;
        case 4:
        html = "<img src='four.png'></img>";
        break;
        case 5:
        html = "<img src='five.png'></img>";
        break;
        case 6:
        html = "<img src='six.png'></img>";
        break;
        case 7:
        html = "<img src='seven.png'></img>";
        break;
        case 8:
        html = "<img src='eight.png'></img>";
        break;
        default:
        alert("Your switch is broken")
        html = "<img src='seychelles.png'></img>"
        break;
      }
    }
    return html;
  }

}

//grid.generateMines(totalMines);
//game = new Game(width, height, totalMines);

function easy()
{
  game = new Game(9, 9, 10);
}

function medium()
{
  game = new Game(16, 16, 40);
}

function hard()
{
  game = new Game(30, 16, 99);
}

function tileMouseDown(event)
{
  let tr = this.parentNode;
  let x = this.cellIndex;
  let y = tr.rowIndex;
  let tile = game.grid.tileAt(x, y);
  //alert(tile.x + "," + tile.y);
  //let tileWest = tile.west();
  /*if (tileWest){
    alert(tileWest.x + "," + tileWest.y);
  }
  else {
    alert(tileWest);
  }*/

  if (event.button == 0) {
    if (!tile.flag) {
      tile.cleared = true;
      if (!game.grid.mined)
        game.grid.generateMines();
    }
  } else if (event.button == 2) {
    if (!tile.cleared) {
      if (tile.flag) {
        tile.flag = false;
        game.grid.remainingMines++;
        game.grid.updateMineCounter();
      } else {
        tile.flag = true;
        game.grid.remainingMines--;
        game.grid.updateMineCounter();
      }
    }
  }

  let html = game.grid.renderTile(x,y);
  this.innerHTML = html;

  if (game.checkLose())
    game.lose();

  if (game.checkWin())
    game.win();

  if (tile.cleared && tile.neighbourCount() == 0) {
    for (let neighbour of tile.neighbours()) {
      if (neighbour && !neighbour.cleared && !neighbour.flag) {

        let x = neighbour.x;
        let y = neighbour.y;
        //alert("clicky!" + x  + "," + y);
        let td = game.grid.table.rows[y].cells[x];
        let boundFunc = tileMouseDown.bind(td);
        boundFunc(event);

      }
    }
  }
}

function tileMouseUp(event)
{

}
