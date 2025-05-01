import {resources} from "./src/Resources.js";

  document.addEventListener('DOMContentLoaded', () => {
console.log("wee.js is loaded and running")
const canvas = document.querySelector("#gamecanvas")
const rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;
console.log("Canvas:", canvas);
const ctx = canvas.getContext("2D");
console.log("Context:", ctx);
  });
  
const draw = () => {
    const sky = resources.images.sky;
    if (sky && sky.isLoaded) {
        console.log("sky image loaded, drawing");
        console.log ("Sky image Object", sky);
        console.log("Canvas context", ctx);
        try {
        ctx.drawImage(sky.image, 0, 0)
        } catch (error){
            console.error("Error drawing image", error);
        }
    } else {
        console.log("sky is not loaded yet")
    }
};

const gameLoop = () => {
    draw();
    requestAnimationFrame(gameLoop);
};

gameLoop();

setInterval(() => {
    console.log("draw")
    draw()
}, 300)