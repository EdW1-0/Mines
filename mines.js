"use strict";

let height = 3;
let width = 4;

let table = document.getElementById('grid');



for (let i=0; i < height; i++)
{
  let tr = document.createElement('tr');
  table.append(tr);
  for (let j=0; j<width; j++)
  {
    let td = document.createElement('td');
    td.innerHTML = "<img src='seychelles.png'></img>"
    tr.append(td);
  }
}
