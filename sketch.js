const width = document.documentElement.clientWidth;
const height = document.documentElement.clientHeight - document.getElementById("boutons").getBoundingClientRect().bottom*1.5;
const baseUnit = 9;
var canvasRect;
var unitView = 90;
var pause = true;
var carte = createMap();

function setup() {
  var canvas = createCanvas(width, height);
  setInterval(() => {
    if (!pause) {
      newRound();
    }
  }, 1000);
  canvas.parent("container");
  canvasRect = document.getElementById("container").getBoundingClientRect();
}

function draw() {
  background(220);
  carte.forEach((tab, y) => {
    tab.forEach((el, x) => {
      if (carte[y][x] == 1) {
        fill(0);
      } else {
        fill(255);
      }
      rect(x * unitView, y * unitView, unitView, unitView);
    });
  });
}

function createMap() {
  return Array(Math.ceil(height / baseUnit))
    .fill()
    .map(() => Array(Math.ceil(width / baseUnit)).fill(0));
}

function nbrVoisins(x, y) {
  function isAlive(x, y) {
    var b =
      carte[y] != undefined && carte[y][x] != undefined && carte[y][x] == 1;
    return b;
  }
  return (
    isAlive(x - 1, y + 1) +
    isAlive(x - 1, y - 1) +
    isAlive(x - 1, y) +
    isAlive(x, y + 1) +
    isAlive(x, y - 1) +
    isAlive(x + 1, y + 1) +
    isAlive(x + 1, y - 1) +
    isAlive(x + 1, y)
  );
}

function newRound() {
  var newArray = createMap();

  carte.forEach((tab, y) => {
    tab.forEach((el, x) => {
      var nbr = nbrVoisins(x, y);
      if (carte[y][x] == 0) {
        if (nbr == 3) {
          newArray[y][x] = 1;
        }
      } else {
        if (nbr == 2 || nbr == 3) {
          newArray[y][x] = 1;
        }
      }
    });
  });
  carte = newArray;
}

function mouseClicked() {
  if (hoverCanvas()) {
    var x = Math.floor(mouseX / unitView);
    var y = Math.floor(mouseY / unitView);
    carte[y][x] = !carte[y][x] + 0;
  }
}

function keyPressed() {
  if (keyCode === 32) {
    changeState();
  }
  if (keyCode === BACKSPACE) {
    reset();
  }
  if (keyCode === ENTER && pause) {
    newRound();
  }
}

function mouseWheel(event) {
  var newBaseUnit = unitView + event.delta / 50;
  if (newBaseUnit < 270 && newBaseUnit > 9 && hoverCanvas()) {
    unitView = newBaseUnit;
  }
}

function changeState() {
  pause = !pause;
}

function reset() {
  unitView = 90;
  pause = true;
  carte = createMap();
}

function hoverCanvas() {
  return (
    mouseX >= 0 &&
    mouseX <= canvasRect.right &&
    mouseY >= 0 &&
    mouseY <= canvasRect.bottom
  );
}
