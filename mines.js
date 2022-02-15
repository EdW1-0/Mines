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
    let td = document.createElement('td');
    td.innerHTML = "<img src='seychelles.png'></img>"
    td.onmousedown = mousedown;
    tr.append(td);

    let tile = new Tile(grid, j, i);
    grid.add(tile);
  }
}

function mousedown(event)
{
  let tr = this.parentNode;
  let x = this.cellIndex;
  let y = tr.rowIndex;
  let tile = grid.tileAt(x, y);
  alert(tile.x + "," + tile.y);
}
