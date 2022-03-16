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

document.getElementById('grid').onmouseover = tileMouseOver;
document.getElementById('grid').onmouseout = tileMouseOut;
document.getElementById('grid').onmouseup = gridMouseUp;
document.getElementById('grid').ondragstart = function() { return false; };


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
    this.lmbmode = false;
    this.rmbmode = false;
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
        td.ondragstart = function() { return false; };
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
    if (tile.highlight)
      html = "<img src='highlight.png'></img>"
    else
      html = "<img src='hidden.png'></img>"
  }else if (tile.mine){
    html = "<img src='mine.png'></img>"
  }else {
      let mines = tile.neighbourMineCount();
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
    game.lmbmode = true;
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
  } else if (event.button == 1) {
    //alert ("Middle!");
    //game.mmbDown = true;

  }

  let html = game.grid.renderTile(x,y);
  this.innerHTML = html;




}

// dclick spec:
// If lmb pressed
// track mouseenter
// highlight cell if unclicked
// on release of lmb
// if rmb not pressed, trigger cell
// If rmb pressed, if on uncleared cell, flag/unflag it.
// mouseup on rmb just clears mask.
// If press lmb and rmb simultaneously,
// on release of either button,
// if mouse is over number cell AND that number of neighbouurs unflagged
// click all unflagged neighbours
// middle click has same effect as lmb/rmb combined
function tileMouseUp(event)
{
  let tr = this.parentNode;
  let x = this.cellIndex;
  let y = tr.rowIndex;
  let tile = game.grid.tileAt(x, y);
  if (event.button == 0) {
    game.lmbmode = false;
    if (!tile.flag) {
      tile.cleared = true;
      if (!game.grid.mined) {
        game.grid.generateMines();
      }
        // Fast clear if clicked on a zero
      if (tile.cleared && tile.neighbourMineCount() == 0) {
          for (let neighbour of tile.neighbours()) {
            if (neighbour && !neighbour.cleared && !neighbour.flag) {

      // TODO: Closely mirrors middle click code.
              let x = neighbour.x;
              let y = neighbour.y;
              //alert("clicky!" + x  + "," + y);
              let td = game.grid.table.rows[y].cells[x];
              let boundFunc = tileMouseUp.bind(td);
              boundFunc(event);

            }
          }
      }
    }
  } else if (event.button == 1) {
    if (tile.cleared) {
      let mines = tile.neighbourMineCount();
      let flags = tile.neighbourFlagCount();
      if (mines == flags) {
        for (let neighbour of tile.neighbours()) {
          if (neighbour && !neighbour.cleared) {
            let x = neighbour.x;
            let y = neighbour.y;
            //alert("clicky!" + x  + "," + y);
            let td = game.grid.table.rows[y].cells[x];
            let boundFunc = tileMouseUp.bind(td);
            let spoofEvent = {};
            Object.assign(spoofEvent, event);
            spoofEvent.button = 0;
            boundFunc(spoofEvent);
          }
        }
      }

    }
  }

  let html = game.grid.renderTile(x,y);
  this.innerHTML = html;

  if (game.checkLose())
    game.lose();

  if (game.checkWin())
    game.win();
}

function tileMouseOver(event)
{
  let target = event.target.closest('td');
  if (target) {
    let tr = target.parentNode;
    let x = target.cellIndex;
    let y = tr.rowIndex;
    console.log("Over " + x + " " + y);
    target.style.background = "pink";

    let tile = game.grid.tileAt(x, y);
    // Looks like it's important not to trigger renderTile unless needed - so
    // take care not to fire it unless it's actually changed. Otherwise we end
    // up endlessly retriggering.
    if (game.lmbmode && !tile.highlight) {
      tile.highlight = true;
      let html = game.grid.renderTile(x,y);
      target.innerHTML = html;
    }
  }
}

function tileMouseOut(event)
{
  let target = event.target.closest('td');
  if (target) {
    let tr = target.parentNode;
    let x = target.cellIndex;
    let y = tr.rowIndex;
    console.log("Out " + x + " " + y);
    target.style.background = "";

    let tile = game.grid.tileAt(x, y);
    if (game.lmbmode && tile.highlight) {
      tile.highlight = false;
      let html = game.grid.renderTile(x,y);
      target.innerHTML = html;
    }
  }
}

function gridMouseUp(event)
{
  if (event.button == 0) {
    game.lmbmode = false;
  }
}
