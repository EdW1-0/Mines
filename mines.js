"use strict";

let height = 3;
let width = 4;

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
  southEast() {return this.tileAt(this.x+1, this.y+1);}
  east() {return this.tileAt(this.x+1, this.y);}
  northEast() {return this.tileAt(this.x+1, this.y-1);}
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
  alert(tile.x + "," + tile.y);
  let tileWest = tile.west();
  if (tileWest){
    alert(tileWest.x + "," + tileWest.y);
  }
  else {
    alert(tileWest);
  }

  if (event.button == 0)
    tile.cleared = true;

  let html = renderTile(x,y);
  this.innerHTML = html;
}

function renderTile(x, y)
{
  let tile = grid.tileAt(x, y);
  if (tile.cleared)
    return "<img src='one.png'></img>"
  else
    return "<img src='hidden.png'></img>"
}
