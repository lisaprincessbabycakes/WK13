// Serial variables
let mSerial;
let connectButton;
let readyToReceive;

// Project variables
let mShapes = [];

function receiveSerial() {
  let line = mSerial.readUntil("\n");
  line = trim(line);

  print("Raw data received:", line); // Debug log

  // Parse plain numeric data
  if (!isNaN(line)) {
    let potValue = int(line);
    print("Parsed potentiometer value:", potValue);

    // Add a new shape with dynamic properties
    mShapes.push({
      x: random(width),
      y: random(height),
      dx: random(-2, 2), // Movement speed in x direction
      dy: random(-2, 2), // Movement speed in y direction
      c: color(
        map(potValue, 0, 4095, 50, 255),
        map(potValue, 0, 4095, 255, 100),
        random(100, 255)
      ),
      size: map(potValue, 0, 4095, 20, 200),
      type: random(["circle", "square", "triangle"]), // Random shape type
    });

    // Limit the number of shapes
    if (mShapes.length > 50) {
      mShapes.shift();
    }
  } else {
    print("Error: Malformed data -", line);
  }

  readyToReceive = true;
}

function connectToSerial() {
  if (!mSerial.opened()) {
    try {
      mSerial.open(9600);
      readyToReceive = true;
      connectButton.hide();
      print("Serial connection established!");
    } catch (error) {
      print("Error opening serial port:", error.message);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  readyToReceive = false;
  mSerial = createSerial();

  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2, height / 2);
  connectButton.mousePressed(connectToSerial);
}

function draw() {
  background(200,20,67);

  for (let i = 0; i < mShapes.length; i++) {
    let shape = mShapes[i];

    // Update position for movement
    shape.x += shape.dx;
    shape.y += shape.dy;

    // Bounce off edges
    if (shape.x < 0 || shape.x > width) shape.dx *= -1;
    if (shape.y < 0 || shape.y > height) shape.dy *= -1;

    // Draw the shape with dynamic properties
    fill(shape.c);
    noStroke();
    if (shape.type === "circle") {
      ellipse(shape.x, shape.y, shape.size);
    } else if (shape.type === "square") {
      rect(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.size, shape.size);
    } else if (shape.type === "triangle") {
      triangle(
        shape.x, shape.y - shape.size / 2,
        shape.x - shape.size / 2, shape.y + shape.size / 2,
        shape.x + shape.size / 2, shape.y + shape.size / 2
      );
    }
  }

  // Request new data from the serial device
  if (mSerial.opened() && readyToReceive) {
    readyToReceive = false;
    mSerial.clear();
    mSerial.write(0xab);
  }

  // Process incoming serial data
  if (mSerial.availableBytes() > 0) {
    receiveSerial();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  connectButton.position(width / 2, height / 2);
}
