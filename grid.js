import Tile from './tile.js'

export default class Grid
{
  static {
    // To stop the context menu firing when we right click a tile
    // Credit: StackOverflow
    document.addEventListener("contextmenu", function(e){
        e.preventDefault();
    }, false);
    // To stop drag/drop trying to engage when we click a tile and don't release before dragging.
    document.getElementById('grid').ondragstart = function() { return false; };
  }

  // Used to populate with mines
  // Credit: Javascript.info
  static randomInteger(min, max) {
    // now rand is from  (min-0.5) to (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

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
  randomCell() {
    let x = Grid.randomInteger(0, this.width-1);
    let y = Grid.randomInteger(0, this.height-1);
    return this.cellAt(x,y);
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
        let x = Grid.randomInteger(0, this.width-1);
        let y = Grid.randomInteger(0, this.height-1);
        tile = this.tileAt(x,y);
      } while (tile.mine || tile.cleared)
      tile.mine = true;
    }
    this.mined = true;
    this.remainingMines = this.totalMines;
    this.updateMineCounter();
  }

// TODO: Surely could achieve this through a custom setter.
  incrementMineCount()
  {
    this.remainingMines++;
    this.updateMineCounter();
  }
  decrementMineCount()
  {
    this.remainingMines--;
    this.updateMineCounter();
  }
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
    html = "images/flag.png";
  } else if (!tile.cleared) {
    if (tile.highlight)
      html = 'images/highlight.png'
    else
      html = 'images/hidden.png'
  }else if (tile.mine){
    html = 'images/mine.png'
  }else {
      let mines = tile.neighbourMineCount();
      switch (mines) {
        case 0:
        html = 'images/zero.png'
        break;
        case 1:
        html = 'images/one.png'
        break;
        case 2:
        html = 'images/two.png'
        break;
        case 3:
        html = 'images/three.png'
        break;
        case 4:
        html = 'images/four.png'
        break;
        case 5:
        html = 'images/five.png'
        break;
        case 6:
        html = 'images/six.png'
        break;
        case 7:
        html = 'images/seven.png'
        break;
        case 8:
        html = 'images/eight.png'
        break;
        default:
        alert("Your switch is broken")
        html = 'images/seychelles.png'
        break;
      }
    }

    let cell = this.cellAt(x,y);
    cell.firstChild.src = html;
  }
}
