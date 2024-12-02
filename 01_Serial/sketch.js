let mSerial;

let connectButton;

let cBackgroundColor;

function receiveSerial() {
  let line = mSerial.readUntil("\n");
  print(line);

  // TODO: assign to color
}

function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600);
    connectButton.hide();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  cBackgroundColor = 0;

  mSerial = createSerial();

  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2, height / 2);
  connectButton.mousePressed(connectToSerial);
}

function draw() {
  background(cBackgroundColor);

  if (mSerial.opened() && mSerial.availableBytes() > 0) {
    receiveSerial();
  }
}
