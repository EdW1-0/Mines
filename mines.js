"use strict";

let height = 10;
let width = 10;
let totalMines = 20;

// To stop the context menu firing when we right click a tile
// Credit: StackOverflow
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);

// Used to populate with mines
// Credit: Javascript.info
function randomInteger(min, max) {
  // now rand is from  (min-0.5) to (max+0.5)
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
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
  constructor(width, height) {
    this.tiles = new Set();
    this.width = width;
    this.height = height;
    this.table = document.getElementById('grid');
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
    for (let i=0; i < this.height; i++)
    {
      let tr = document.createElement('tr');
      this.table.append(tr);
      for (let j=0; j<this.width; j++)
      {
        let tile = new Tile(this, j, i);
        this.add(tile);

        let td = document.createElement('td');

        td.innerHTML = renderTile(j,i);
        td.onmousedown = mousedown;
        tr.append(td);
      }
    }
  }

  generateMines(totalMines) {
    for (let i = 0; i < totalMines; i++) {
      if (totalMines >= this.width * this.height)
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
  }

}

let grid = new Grid(width, height);
grid.generateTiles();
//grid.generateMines(totalMines);



function mousedown(event)
{
  let tr = this.parentNode;
  let x = this.cellIndex;
  let y = tr.rowIndex;
  let tile = grid.tileAt(x, y);
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
      if (!grid.mined)
        grid.generateMines(totalMines);
    }
  } else if (event.button == 2) {
    if (!tile.cleared)
      tile.flag = !tile.flag;
  }

  let html = renderTile(x,y);
  this.innerHTML = html;
}

function renderTile(x, y)
{
  let tile = grid.tileAt(x, y);
  if (tile.flag)
    return "<img src='flag.png'></img>"
  else if (!tile.cleared)
    return "<img src='hidden.png'></img>"
  else if (tile.mine)
    return "<img src='mine.png'></img>"
  else {
    let mines = tile.neighbourCount();
    switch (mines) {
      case 0:
        return "<img src='zero.png'></img>";
      case 1:
        return "<img src='one.png'></img>";
      case 2:
        return "<img src='two.png'></img>";
      case 3:
        return "<img src='three.png'></img>";
      case 4:
        return "<img src='four.png'></img>";
      case 5:
        return "<img src='five.png'></img>";
      case 6:
        return "<img src='six.png'></img>";
      case 7:
        return "<img src='seven.png'></img>";
      case 8:
        return "<img src='eight.png'></img>";
      default:
        alert("Your switch is broken")
        return "<img src='seychelles.png'></img>"
    }
  }
}
