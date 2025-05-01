const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Game Settings
const tileSize = 64;
const mapWidth = 29.5;
const mapHeight = 14;
const characterTileSize = 32;

canvas.width = mapWidth * tileSize;
canvas.height = mapHeight * tileSize;

// Load Spritesheets
const playerUpSheet = new Image();
playerUpSheet.src = "/Ward/michael front.png";
const playerDownSheet = new Image();
playerDownSheet.src = "/Ward/michael back.png";
const playerLeftSheet = new Image();
playerLeftSheet.src = "/Ward/michael left.png";
const playerRightSheet = new Image();
playerRightSheet.src = "/Ward/michael rightt.png";

const DoctorbackgroundSprite = new Image();
DoctorbackgroundSprite.src = "/Ward/Doctors room.png"; 

const DoctorcollisionMapImage = new Image();
DoctorcollisionMapImage.src = "/Ward/collision map (doctors room)-export.png"; 

const DoctoroverlayImage = new Image ();
DoctoroverlayImage.src = "/Ward/lighting(doctors room).png"

const soundBuffers = {}

function loadSound(url, name) {
  fetch(url)
  .then(response => {
    console.log("Array buffer received:", arrayBuffer);
    response.arrayBuffer()
  })
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  .then(audioBuffer => {
      soundBuffers[name] = audioBuffer;
      console.log(`Sound loaded: ${name}`);
  })
  .catch(error => console.error(`Error loading sound ${name}:`, error));
}

console.log("Attempting to load: footsteps in doctors room");
loadSound('/Ward/footsteps in doctors room.mp3');


// Player Animation

const playerFrameWidth = 54; //playerAnimationWidth
const playerFrameHeight = 123;//playerAnimationHeight
const playerFrameCount = 2; //Number of player frames per second
let playerFrame = 0;
let playerFrameTimer = 0;
const playerFrameSpeed = 24; //animation speed
let playerDirection = "down"; // Initial direction

// Player
let playerX = 14;
let playerY = 13;

const door3 = [
  {
    x: 14, // X-coordinate of the door (in tiles)
    y: 13, // Y-coordinate of the door (in tiles)
    width: 1, // Adjust width as needed (in tiles)
    height: 1, // Adjust height as needed (in tiles)
    isDoor: true, // Flag this object as a door for specific interaction
    targetFile: "hallway.html", // The HTML file to load
    interactionKey: "f", // The key to press for interaction
    isPlayerNear: false, // To track if the player is near
  },
];


// Input Handling
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Game Loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function playSound(name, volume = 1) {
  if (soundBuffers[name]) {
      const source = audioContext.createBufferSource();
      source.buffer = soundBuffers[name];

      // Control volume
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      source.connect(gainNode).connect(audioContext.destination);

      source.start();
  } else {
      console.warn(`Sound not loaded: ${name}`);
  }
}

let isMoving = false;
let footstepTimer = 0;
const footstepInterval = 15;

// Update Function
function update() {
  
  let moving = false;

  if (keys["w"]) {
    console.log(keys);
    playerY -= 0.03;
    playerDirection = "up";
    moving = true;
  }
  if (keys["s"]) {
    playerY += 0.03;
    playerDirection = "down";
    moving = true;
  }
  if (keys["a"]) {
    playerX -= 0.03;
    playerDirection = "left";
    moving = true;
  }
  if (keys["d"]) {
    playerX += 0.03;
    playerDirection = "right";
    moving = true;
  }

  playerX = Math.max(0, Math.min(playerX, mapWidth - 1));
  playerY = Math.max(0, Math.min(playerY, mapHeight - 1));

  if (moving) {
    playerFrameTimer++;
    if (playerFrameTimer >= playerFrameSpeed) {
      playerFrameTimer = 0;
      playerFrame = (playerFrame + 1) % playerFrameCount;
    }
  } else {
    playerFrame = 0;
  }

  isMoving = keys["w"] || keys["s"] || keys["a"] || keys["d"];

  if (isMoving) {
      footstepTimer++;
      if (footstepTimer % footstepInterval === 0) {
          playSound('/Ward/footsteps in doctors room.mp3', 0.5);
      }
  } else {
      footstepTimer = 0; // Reset timer when not moving
  }

  
  door3.forEach((object) => {
    const playerTileX = Math.floor(playerX); // Assuming playerX/tileSize gives tile coords
    const playerTileY = Math.floor(playerY); // Assuming playerY/tileSize gives tile coords

    const interactionDistance = 1; // Adjust as needed

    if (object.isDoor &&
        Math.abs(playerTileX - object.x) < interactionDistance &&
        Math.abs(playerTileY - object.y) < interactionDistance) {
      object.isPlayerNear = true;
      if (keys[object.interactionKey]) { // Check if the specific interaction key is pressed
        console.log(`Interacting with door at (${object.x}, ${object.y}), loading ${object.targetFile}`);
        window.location.href = object.targetFile;
      }
    } else {
      object.isPlayerNear = false;
    }
  });

  
  
  
}



// Draw Function
function draw() {

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Background
  const bgWidth = DoctorbackgroundSprite.width;
  const bgHeight = DoctorbackgroundSprite.height;
  const scale = 0.55; 
  const scaledWidth = bgWidth * scale;
  const scaledHeight = bgHeight * scale;

  ctx.drawImage(
    DoctorbackgroundSprite,
    0,
    0,
    bgWidth,
    bgHeight,
    0,
    0,
    scaledWidth,
    scaledHeight
  );

  function draw() {
  
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw Background 
    const bgWidth = DoctorbackgroundSprite.width;
    const bgHeight = DoctorbackgroundSprite.height;
    const scale = 0.55; 
    const scaledWidth = bgWidth * scale;
    const scaledHeight = bgHeight * scale;
  
    ctx.drawImage(
      DoctorbackgroundSprite,
      0,
      0,
      bgWidth,
      bgHeight,
      0,
      0,
      scaledWidth,
      scaledHeight
    );
  
    // Draw Collision Map 
    ctx.drawImage(
      DoctorcollisionMapImage,
      0,
      0,
      DoctorcollisionMapImage.width,
      DoctorcollisionMapImage.height,
      0,
      0,
      scaledWidth,
      scaledHeight
    );
  }

  // Draw Player

  const playerTileX = Math.floor(playerX);
  const playerTileY = Math.floor(playerY);

  const collisionCanvas = document.createElement('canvas'); 
  const collisionCtx = collisionCanvas.getContext('2d');
  collisionCanvas.width = DoctorcollisionMapImage.width;
  collisionCanvas.height = DoctorcollisionMapImage.height;
  collisionCtx.drawImage(DoctorcollisionMapImage, 0, 0); 
  const collisionData = collisionCtx.getImageData(playerTileX * tileSize, playerTileY * tileSize, 1, 1).data; // Get pixel data

  if (collisionData[0] === 0 && collisionData[1] === 0 && collisionData[2] === 0 && collisionData[3] === 255) { 
    // Revert player's position to the previous position
    console.log("Collision detected!");
    if (keys["w"]) playerY += 0.03;
    if (keys["s"]) playerY -= 0.03;
    if (keys["a"]) playerX += 0.03;
    if (keys["d"]) playerX -= 0.03;
  }

  let currentSheet;
  if (playerDirection === "up") {
    currentSheet = playerUpSheet;
  } else if (playerDirection === "down") {
    currentSheet = playerDownSheet;
  } else if (playerDirection === "left") {
    currentSheet = playerLeftSheet;
  } else if (playerDirection === "right") {
    currentSheet = playerRightSheet;
  }

  let frameX = playerFrame * playerFrameWidth;
  let frameY = 100; // Default to the first row

  // Adjust frameY based on direction (if needed)
  if (playerDirection === "up") {
    frameY = 0;
  } else if (playerDirection === "down") {
    frameY = 0; 
  } else if (playerDirection === "left") {
    frameY = 0;
  } else if (playerDirection === "right") {
    frameY = 0; 
  }

  ctx.drawImage(
    currentSheet,
    frameX,
    frameY,
    playerFrameWidth,
    playerFrameHeight,
    playerX * characterTileSize,
    playerY * characterTileSize,
    playerFrameWidth,
    playerFrameHeight,
  );

  ctx.drawImage(
    DoctoroverlayImage,
    0,
    0,
    DoctoroverlayImage.width,
    DoctoroverlayImage.height,
    0,
    0,
    scaledWidth, 
    scaledHeight 
  );

}

gameLoop();