"use strict";

let height = 3;
let width = 4;

let table = document.getElementById('grid');

alert("Got here");

for (let i=0; i < height; i++)
{
  alert("Now here");
  let tr = document.createElement('tr');
  table.append(tr);
  for (let j=0; j<width; j++)
  {
    alert("And here");
    let td = document.createElement('td');
    td.innerHTML = "<img src='seychelles.png'></img>"
    tr.append(td);
  }
}
