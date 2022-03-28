export default class Tile
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
            this.grid.incrementMineCount();
          } else {
            this.flag = true;
            this.grid.decrementMineCount();
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
      // Deal with middle clicks to clear unflagged cells
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
  }
}