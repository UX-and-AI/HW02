let HAND_MODEL = "https://teachablemachine.withgoogle.com/models/5J5Nr6StB/";
let mCamera, mModel, mDetected = [];
let x, y, score = 0;
let lives=20;
let balls = [];
let bigBalls = [];
let gameStarted = false;
let gameOver = false;
let buttonWidth = 300; 
let buttonHeight = 100; 
let buttonX, buttonY;


function preload() {
  mCamera = createCapture(VIDEO, { flipped: true });
  mCamera.hide();
  mModel = ml5.imageClassifier(HAND_MODEL, { flipped: true });
}

function updateDetected(detected) {
  mDetected = detected;
  mModel.classify(mCamera, updateDetected);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = width / 2;
  y = height - 50;
  buttonX = width / 2;
  buttonY = height / 2;
}

function draw() {
  background(224, 228, 252);
  
  image(mCamera, 0, 0,250,200);

  if (!gameStarted || gameOver) {
    noStroke();
    fill(85, 105, 232);
    rectMode(CENTER);
    rect(buttonX, buttonY, buttonWidth, buttonHeight, 20);
    
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    if (gameOver) {
      text("Game Over\nClick to Replay", buttonX, buttonY);
    } else {
      text("Click to Start", buttonX, buttonY);
    }
    return;
  }

  push();
if (mDetected.length > 0) {
  let highestLabel = mDetected[0].label;
  let highestConfidence = mDetected[0].confidence;
  for (let i = 1; i < mDetected.length; i++) {
    if (mDetected[i].confidence > highestConfidence) {
      highestLabel = mDetected[i].label;
      highestConfidence = mDetected[i].confidence;
    }
  }

  fill(85, 105, 232);
  rectMode(CENTER);
  rect(width/2, 100, 150, 40,20);
  fill(255);  
  textSize(24);  
  text( highestLabel, width/2, 100); 
  
  if (highestLabel === "Left Point") {
    x -= 5; 
  } else if (highestLabel === "Right Point") {
    x += 5; 
  } else if (highestLabel === "No Hands") {
    x += 0;
  }
}

pop();

x = constrain(x, 0, windowWidth - 80); 
y = constrain(y, 0, windowHeight - 20); 
  fill(142,151,195);
  rect(x, y, 80, 20,20,20);

  for (let ball of balls) {
    ball.update();
    ball.display();
  }

  for (let bigBall of bigBalls) {
    bigBall.update();
    bigBall.display();
  }

  fill(0);
  textSize(24);
  text(`Score: ${score}`, width/2+100, 30);
  text(`Lives: ${lives}`, width/2-100, 30);
}

function mousePressed() {
  if (gameOver) {
    gameOver = false;
    score = 0;
    lives = 20;
    balls = [];
    bigBalls = [];
    gameStarted = false;  
    return;
  }

  if (
    mouseX > buttonX - buttonWidth / 2 && 
    mouseX < buttonX + buttonWidth / 2 &&
    mouseY > buttonY - buttonHeight / 2 && 
    mouseY < buttonY + buttonHeight / 2
  ) {
    
    gameStarted = true;
    mModel.classify(mCamera, updateDetected);
    for (let i = 0; i < 10; i++) {
      balls.push(new Ball(random(width), random(-500, 0), random(10, 30)));
    }
    for (let i = 0; i < 5; i++) {
      bigBalls.push(new BigBalls(random(width), random(-500, 0), random(40, 70)));
    }
  }
}

class Ball {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = random(1, 3);
  }

  update() {
    this.y += this.speed;

    if (
      this.x > x && this.x < x + 50 &&
      this.y + this.size / 2 > y && this.y - this.size / 2 < y + 20
    ) {
      this.y = random(-100, -10);
      this.x = random(width);
      score++;
    }

    if (this.y > height) {
      this.y = random(-100, -10);
      this.x = random(width);
    }
  }

  display() {
    noStroke();
    fill(4,36,217);
    ellipse(this.x - 5, this.y, this.size + 5, this.size + 4);
  }
}

class BigBalls {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = random(1, 3);
  }

  update() {
    this.y += this.speed;

    if (
      this.x > x && this.x < x + 50 &&
      this.y + this.size / 2 > y && this.y - this.size / 2 < y + 20
    ) {
      this.y = random(-100, -10);
      this.x = random(width);
      lives--;
      if (lives <= 0) {
        gameOver = true;
      }
    }

    if (this.y > height) {
      this.y = random(-100, -10);
      this.x = random(width);
    }
  }

  display() {
    stroke(37,58,208);
    noFill();
    ellipse(this.x - 5, this.y, this.size + 10, this.size + 5);
  }
}





