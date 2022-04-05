import Game from "./mines.js"

document.getElementById("solve").onclick = solve;

function solve()
{
    console.log("Solving!");
    if (Game.game)
       firstClick(Game.game);
    else
       alert("Not instantiated yet");
}

function firstClick(game)
{
    let grid = game.grid;

    let cell = grid.cellAt(0,0);
    const ev = new MouseEvent("mouseup", {button:0});


    cell.dispatchEvent(ev);
}