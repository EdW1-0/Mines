"use strict";

let height = 10;
let width = 10;

// To stop the context menu firing when we right click a tile
document.addEventListener("contextmenu", function(e){
    e.preventDefault();
}, false);


let table = document.getElementById('grid');


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

let grid = new Set();

grid.tileAt = function (x, y)
{
  let foundTile = null;
  for (let tile of this){
    if (tile.x == x && tile.y == y)
    {
      foundTile = tile;
      break;
    }
  }

  return foundTile;
};


for (let i=0; i < height; i++)
{
  let tr = document.createElement('tr');
  table.append(tr);
  for (let j=0; j<width; j++)
  {
    let tile = new Tile(grid, j, i);
    if (j==2) tile.mine=true;
    grid.add(tile);

    let td = document.createElement('td');

    td.innerHTML = renderTile(j,i);
    td.onmousedown = mousedown;
    tr.append(td);
  }
}

function mousedown(event)
{
  let tr = this.parentNode;
  let x = this.cellIndex;
  let y = tr.rowIndex;
  let tile = grid.tileAt(x, y);
  //alert(tile.x + "," + tile.y);
  let tileWest = tile.west();
  /*if (tileWest){
    alert(tileWest.x + "," + tileWest.y);
  }
  else {
    alert(tileWest);
  }*/

  if (event.button == 0) {
    if (!tile.flag)
      tile.cleared = true;
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
