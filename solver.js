import Game from "./mines.js"

document.getElementById("solve").onclick = solve;
document.getElementById("stop").onclick = stop;
document.getElementById("tick").onclick = pulse;

let timerId = null;

function solve()
{
    console.log("Solving!");
    if (Game.game) {
        if (!Game.game.grid.mined)
          firstClick(Game.game);

        timerId = setInterval(pulse, 5000);
    }
    else
        alert("Not instantiated yet");
}

function stop()
{
    if (timerId)
        clearTimeout(timerId);
}

function firstClick(game)
{
    let grid = game.grid;

    // Pick a cell at random
    let cell = grid.randomCell();
    const ev = new MouseEvent("mouseup", {button:0, bubbles:true});


    cell.dispatchEvent(ev);
}


function pulse()
{
    let grid = Game.game.grid;

    // Iterate over tiles 
    for (let x = 0; x < grid.width; x++) {
        for (let y = 0; y < grid.height; y++) {
            let tile = grid.tileAt(x,y);

            console.log("Checking " + x + ", " + y);
            if (!tile.cleared)
              continue;

            console.log(x.toString() + ", " + y.toString() + " is clear");
            flagMinedRule(tile);
            clearUnflaggedRule(tile);
        }
    }
}

function flagMinedRule(tile)
{
    // Figure out how many neighbours are still hidden
    let neighbours = tile.neighbours();
    let hidden = 0;
    for (let neighbour of neighbours)
    {
        if (neighbour && !neighbour.cleared)
           hidden++;
    }

    // If this is equal to mine count, flag all neighbouring hidden cells
    if (hidden == tile.neighbourMineCount())
    {
        
        for (let neighbour of neighbours)
        {
            if (neighbour && !neighbour.cleared && !neighbour.flag) {
                console.log("Should be flagging");
               rightClickTile(neighbour, 2);
            }
        }
    }
}

function clearUnflaggedRule(tile)
{
    // Figure out how many neighbours are still hidden
    let neighbours = tile.neighbours();
    // If this is equal to mine count, flag all neighbouring hidden cells
    if (tile.neighbourFlagCount() == tile.neighbourMineCount())
    {    
        for (let neighbour of neighbours)
        {
            if (neighbour && !neighbour.cleared && !neighbour.flag) {
                console.log("Should be clearing");
               leftClickTile(neighbour, 2);
            }
        }
    }
}


function leftClickTile(tile)
{
    clickTile(tile, 0);
}

function rightClickTile(tile)
{
    clickTile(tile, 2);
}

function middleClickTile(tile)
{
    clickTile(tile, 1);
}

function clickTile(tile, button)
{
    console.log("Clicking");
    let grid = Game.game.grid;

    let x = tile.x;
    let y = tile.y;
    let cell = grid.cellAt(x,y);
    let type = button ? "mousedown": "mouseup";
    const ev = new MouseEvent(type, {button: button, bubbles:true});


    cell.dispatchEvent(ev);
}