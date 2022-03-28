export default class Smiley
{
  constructor() {
    this.smiley = document.getElementById("smiley");
  }

  smile() {
    this.smiley.src = 'images/smiley.png';
  }

  cool() {
    this.smiley.src = 'images/smiley_shades.png';
  }

  dead() {
    this.smiley.src = 'images/smiley_dead.png';
  }
}
