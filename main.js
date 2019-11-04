let x;
let y;
let angle;
let won;
let start;
let end;

let cheeseX = 125;
let cheeseY = 125;
let cheeseX1 = cheeseX - 45;
let cheeseY1 = cheeseY - 35;
let cheeseX2 = cheeseX + 50;
let cheeseY2 = cheeseY - 15;
let cheeseX3 = cheeseX;
let cheeseY3 = cheeseY + 45;

let DEBUG = false;

function setup() {
  createCanvas(innerWidth, innerHeight);

  x = innerWidth * 0.9;
  y = innerHeight * 0.9;
  angle = random(-PI / 2, -PI);
  won = false;
  start = millis();

  if (DEBUG) {
    restartOnFocus();
  }
}

function draw() {
  background(0, 156, 0);
  instructions();
  picnic();

  if (frameCount % 15 === 0 && !won) {
    // if mouse is close enough, average the angle to mouse with current angle
    if (dist(mouseX, mouseY, x, y) < 200) {
      let angle2 = atan2(mouseY - y, mouseX - x);

      // https://en.wikipedia.org/wiki/Mean_of_circular_quantities
      angle = atan2(
        (1 / 3) * (sin(angle) + sin(angle) + sin(angle2)),
        (1 / 3) * (cos(angle) + cos(angle) + cos(angle2))
      );
    }

    // rotate ant randomly
    angle = angle + random(-PI / 6, PI / 6);
  }

  ant(x, y, angle);

  if (!won) {
    // move the ant
    x = constrain(x + cos(angle), 15, innerWidth - 15);
    y = constrain(y + sin(angle), 15, innerHeight - 15);
  }

  // get slope and y-intercept of the three lines that make the cheese triangle
  // m = (y2 - y1) / (x2 - x1)
  // y = m * x + b
  // b = y - (m * x)
  let m1 = (cheeseY2 - cheeseY1) / (cheeseX2 - cheeseX1);
  let b1 = cheeseY1 - m1 * cheeseX1;
  let m2 = (cheeseY3 - cheeseY2) / (cheeseX3 - cheeseX2);
  let b2 = cheeseY2 - m2 * cheeseX2;
  let m3 = (cheeseY1 - cheeseY3) / (cheeseX1 - cheeseX3);
  let b3 = cheeseY3 - m3 * cheeseX3;

  // detect if the ant is on top of the cheese and display a winning message
  if (m1 * x + b1 < y - 15) {
    if (m2 * x + b2 > y + 15) {
      if (m3 * x + b3 > y + 15) {
        if (!won) {
          end = millis();
          won = true;
        }

        fill(0);
        stroke(255);
        strokeWeight(2);
        textAlign(CENTER, CENTER);
        textSize(32);
        text(
          "You did it! The ant reached the cheese!\n" +
            "Now the ant can be happy.\n" +
            "Your time: " +
            (end - start) / 1000 +
            " seconds",
          innerWidth / 2,
          innerHeight / 2
        );
      }
    }
  }

  // mouse cheese piece
  fill(255, 220, 64);
  stroke(230, 190, 0);
  strokeWeight(2);
  triangle(
    mouseX - 5,
    mouseY - 3,
    mouseX - 3,
    mouseY + 5,
    mouseX + 8,
    mouseY - 3
  );

  if (DEBUG) {
    showMousePosition();
  }
}

function ant(x, y, angle) {
  noStroke();
  fill(0);
  translate(x, y);
  rotate(angle);

  // body
  ellipse(7, 0, 11, 13);
  circle(0, 0, 12);
  ellipse(-7, 0, 20, 15);

  strokeWeight(2);
  stroke(0);

  // legs
  line(-10, 0, -15, 13);
  line(-10, 0, -15, -13);
  line(-2, 0, -5, 13);
  line(-2, 0, -5, -13);
  line(2, 0, 7, 13);
  line(2, 0, 7, -13);

  // antennae
  strokeWeight(1);
  line(12, -2, 20, -5);
  line(12, 2, 20, 5);

  // boundary for mouse interaction with ant
  if (DEBUG) {
    fill(0, 0, 0, 0);
    stroke(0, 128, 0, 128);
    circle(0, 0, 200);
  }

  resetMatrix();
}

function picnic() {
  let x = 20;
  let y = 20;
  let size = 350;

  stroke(64);
  strokeWeight(1);

  // big red square
  fill(255, 56, 56);
  rect(x, y, size, size);

  let tileCount = 4;
  let tileSize = size / (tileCount * 2);

  // draw white checkered squares
  fill(255);
  for (let i = 0; i < tileCount * 2; i++) {
    let offsetY = tileSize * i;

    for (let j = 0; j < tileCount; j++) {
      let offsetX = tileSize * j * 2;
      if (i % 2 === 0) {
        offsetX = offsetX + tileSize;
      }
      rect(x + offsetX, y + offsetY, tileSize, tileSize);
    }
  }

  // The Cheese
  cheese();
}

function cheese() {
  stroke(230, 190, 0);
  strokeWeight(2);
  fill(255, 220, 64);
  triangle(cheeseX1, cheeseY1, cheeseX2, cheeseY2, cheeseX3, cheeseY3);

  fill(230, 190, 0);
  circle(cheeseX, cheeseY + 22, 10);
  circle(cheeseX - 10, cheeseY - 5, 20);
  circle(cheeseX + 15, cheeseY + 10, 17);
  circle(cheeseX - 30, cheeseY - 25, 8);
  circle(cheeseX + 25, cheeseY - 10, 8);
}

function instructions() {
  fill(255);
  stroke(0, 128, 0);
  strokeWeight(2);

  textSize(32);
  textAlign(LEFT, BOTTOM);
  text(
    "Use your mouse to help guide\nthe ant to the cheese!",
    50,
    innerHeight - 75
  );

  textSize(14);
  text("Hint: get close to the ant!", 50, innerHeight - 12);
}

function showMousePosition() {
  fill(0);
  stroke(255);
  strokeWeight(1);
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text(`(${mouseX}, ${mouseY})`, 10, 14);
}

function restartOnFocus() {
  window.addEventListener("focus", () => {
    location.reload();
  });
}
