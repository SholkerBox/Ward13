const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const DialogBox = document.getElementById('Dialog_Box');
const dialogTextElement = document.getElementsByClassName('Dialog_box_Bed');
let isDialogOpen = false;
let typingInterval;
const inventorySlot = document.getElementsByClassName('inventory-slot');
const Slot1 = document.getElementById('slot-number1');
const Room_key = document.getElementById('slot-image1');
let equippedItem = null;


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

const backgroundSprite = new Image();
backgroundSprite.src = "/Ward/room.png"; 

const collisionMapImage = new Image();
collisionMapImage.src = "/Ward/collision map.png"; 

const overlayImage = new Image ();
overlayImage.src = "/Ward/lighting ointeraction.png"

const IdleAnimation = new Image ();
IdleAnimation.src = 'Ward/michael idle.png';

const idleAnimationFrames = [
  {x: 0, y: 0},
  {x: mapWidth, y: 0},
];




// Player Animation

const playerFrameWidth = 54; //playerAnimationWidth
const playerFrameHeight = 123;//playerAnimationHeight
const playerFrameCount = 2; //Number of player frames per second
let playerFrame = 0;
let playerFrameTimer = 0;
let currentIdleFrame = 0;
let IdleAnimationSpeed = 4;
const playerFrameSpeed = 24; //animation speed
let playerDirection = "down"; // Initial direction

// Player
let playerX = 8;
let playerY = 12;



const door = [
  {
    x: 6, // X-coordinate of the door (in tiles)
    y: 12, // Y-coordinate of the door (in tiles)
    width: 1, // Adjust width as needed (in tiles)
    height: 0.5, // Adjust height as needed (in tiles)
    isDoor: true, // Flag this object as a door for specific interaction
    targetFile: "hallway.html", // The HTML file to load
    interactionKey: "f", // The key to press for interaction
    isPlayerNear: false, // To track if the player is near
  },
];

const bed = [ {
  x: 9,
  y: 4,
  width: 1,
  height: 1,
  isBed: true,
  interactionKey: "f",
  isPlayerNear: false,
},
];

const bin = [{
  x:19,
  y:12,
  width: 0.5,
  height: 0.5,
  isBin: true,
  interactionKey: "f",
  isPlayerNear: false,
},
]

// Input Handling
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
 // console.log ("A key has been hit");
 //console.log(e);
  //console.log("The user just pressed the\n" + e.key + "\nkey")

  if (keys["1"]) {
    const firstSlot = inventorySlot[0];
    if (Room_key && Room_key.style.display === 'block' && Room_key.src !== '') {
      
      if (equippedItem === 'Room_key') {
        console.log("Key unequipped");
        firstSlot.classList.remove('equipped');
      }else {
      equippedItem = 'Room_key';
      console.log("Key equipped!");
      firstSlot.classList.add('equipped');
      }
    } else {
      equippedItem = null; 
      console.log("Key unequipped (or not in inventory).");
    }
    keys["1"] = false;
  }
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

// Update Function
function update() {
  
  let moving = false;

  if (keys["w"]) {
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

  door.forEach((object) => {
    const playerTileX = Math.floor(playerX); // Assuming playerX/tileSize gives tile coords
    const playerTileY = Math.floor(playerY); // Assuming playerY/tileSize gives tile coords

    const interactionDistance = 1.2;

    if (object.isDoor &&
        Math.abs(playerTileX - object.x) < interactionDistance &&
        Math.abs(playerTileY - object.y) < interactionDistance) {
      object.isPlayerNear = true;
      if (keys[object.interactionKey]) {
        if (equippedItem === 'Room_key') {
          console.log("Door opened! Player passed through.");
          window.location.href = object.targetFile;
         // Check if the specific interaction key is pressed
       // console.log(`Interacting with door at (${object.x}, ${object.y}), loading ${object.targetFile}`);
        } else {
        document.getElementById('Dialog_box').style.opacity=1;
        keys[object.interactionKey] = false;
        }
      }
    } else {
      object.isPlayerNear = false;
      document.getElementById('Dialog_box').style.opacity=0;
    }
  });

  bed.forEach((object) => {
    const playerTileX = Math.floor(playerX); // Assuming playerX/tileSize gives tile coords
    const playerTileY = Math.floor(playerY); // Assuming playerY/tileSize gives tile coords

    const interactionDistance = 1.2;

    if (object.isBed &&
        Math.abs(playerTileX - object.x) < interactionDistance &&
        Math.abs(playerTileY - object.y) < interactionDistance) {
      object.isPlayerNear = true;
      console.log("Planning on sleeping?");
      if (keys[object.interactionKey]) { // Check if the specific interaction key is pressed
       // console.log(`Interacting with Bed at (${object.x}, ${object.y})`);
        document.getElementById('Dialog_box_Bed').style.opacity=1;
      }
    } else {
      object.isPlayerNear = false;
      document.getElementById('Dialog_box_Bed').style.opacity=0;
    }
  });

  bin.forEach((object) => {
    const playerTileX = Math.floor(playerX); // Assuming playerX/tileSize gives tile coords
    const playerTileY = Math.floor(playerY); // Assuming playerY/tileSize gives tile coords

    const interactionDistance = 1.2;

    if (object.isBin &&
        Math.abs(playerTileX - object.x) < interactionDistance &&
        Math.abs(playerTileY - object.y) < interactionDistance) {
      object.isPlayerNear = true;
      console.log("What do you plan on doing with that?");
      if (keys[object.interactionKey]) { // Check if the specific interaction key is pressed
       // console.log(`Interacting with Garbage Bin at (${object.x}, ${object.y}), loading ${object.targetFile}`);
        document.getElementById('Dialog_box_Bin').style.opacity=1;
        Slot1.style.display = 'none';
        Room_key.style.display = 'block';
      }
    } else {
      object.isPlayerNear = false;
      document.getElementById('Dialog_box_Bin').style.opacity=0; 

    }
  });

  
}

// Draw Function
function draw() {

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Background
  const bgWidth = backgroundSprite.width;
  const bgHeight = backgroundSprite.height;
  const scale = 0.55; 
  const scaledWidth = bgWidth * scale;
  const scaledHeight = bgHeight * scale;

  ctx.drawImage(
    backgroundSprite,
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
    const bgWidth = backgroundSprite.width;
    const bgHeight = backgroundSprite.height;
    const scale = 0.55; 
    const scaledWidth = bgWidth * scale;
    const scaledHeight = bgHeight * scale;
  
    ctx.drawImage(
      backgroundSprite,
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
      collisionMapImage,
      0,
      0,
      collisionMapImage.width,
      collisionMapImage.height,
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
  collisionCanvas.width = collisionMapImage.width;
  collisionCanvas.height = collisionMapImage.height;
  collisionCtx.drawImage(collisionMapImage, 0, 0); 
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

  if (playerFrameTimer % playerFrameSpeed === 0) {
   // currentIdleFrame = (currentIdleFrame + 1) % idleAnimationFrames.length;
    playerFrameTimer = 0;
  }

  const frameX2 = idleAnimationFrames[currentIdleFrame].x;
  const frameY2 = idleAnimationFrames[currentIdleFrame].y;

  //ctx.drawImage (
   // IdleAnimation,
   // frameX2, frameY2, mapWidth, mapHeight,
  //  playerX * tileSize, playerY * tileSize, tileSize, tileSize
//  );

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
    overlayImage,
    0,
    0,
    overlayImage.width,
    overlayImage.height,
    0,
    0,
    scaledWidth, 
    scaledHeight 
  );

  
  door.forEach((object) => {
    if (object.isDoor && object.x === 6 && object.y === 12) { // Check for the specific door
      const playerTileX = Math.floor(playerX); // Assuming playerX/tileSize gives tile coords
      const playerTileY = Math.floor(playerY); // Assuming playerY/tileSize gives tile coords
      const interactionDistance = 1.1; // Adjust as needed

      if (Math.abs(playerTileX - object.x) < interactionDistance &&
          Math.abs(playerTileY - object.y) < interactionDistance) {
        const indicatorX = (playerX - 3) * tileSize;
        const indicatorY = (playerY - 7) * tileSize; // Position above the player

        ctx.fillStyle = 'white';
        ctx.font = '24px Joystix Monospace';
        ctx.textAlign = 'center';
        ctx.fillText(object.interactionKey.toUpperCase(), indicatorX + tileSize / 1, indicatorY + 20);
        ctx.textAlign = 'start';
      }
    }
  });

}

gameLoop();