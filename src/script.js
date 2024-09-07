let canvas = document.querySelector("canvas");
let toolbtns = document.querySelectorAll(".tool");
let fillColor = document.getElementById("fill-color");
let sizeSlider = document.getElementById("size-slider");
let colorBox = document.getElementById("color-picker");
let clearCanvasBtn = document.getElementById("clearCanvas");
let saveImageBtn = document.getElementById("saveAsImage");
let ctx = canvas.getContext("2d");

let prevMouse = {
  mx: undefined,
  my: undefined,
};
let mouse = {
  mx: undefined,
  my: undefined,
};
let isDrawing = false;
let brushWidth = 2;
let selectedTool = "brush";
let snapShot;
let selectedColor = "black";


// pending
const setCanvasBackground = () =>{
  ctx.fillStyle = "#F8F8FF";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = selectedColor;
}

function handleResize() {
  // Get the dimensions of the canvas's container
  let containerWidth = canvas.parentElement.offsetWidth;
  let containerHeight = canvas.parentElement.offsetHeight;

  // Set canvas dimensions to match the container's dimensions
  canvas.width = containerWidth;
  canvas.height = containerHeight;
  setCanvasBackground();
}

window.addEventListener("load", handleResize);
window.addEventListener("resize", handleResize);
// To track position of pointer inside canvas
canvas.addEventListener("mousemove", (e) => {
  mouse.mx = e.offsetX;
  mouse.my = e.offsetY;
});

let enableDraw = (e) => {
  isDrawing = true;
  prevMouse.mx = e.offsetX;
  prevMouse.my = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};
let disableDraw = () => (isDrawing = false);

const drawRectangle = () => {
  if (!fillColor.checked) {
    return ctx.strokeRect(
      mouse.mx,
      mouse.my,
      prevMouse.mx - mouse.mx,
      prevMouse.my - mouse.my
    );
  }
  return ctx.fillRect(
    mouse.mx,
    mouse.my,
    prevMouse.mx - mouse.mx,
    prevMouse.my - mouse.my
  );
};

const drawCircle = () => {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(prevMouse.mx - mouse.mx, 2) + Math.pow(prevMouse.my - mouse.my, 2)
  );
  ctx.arc(prevMouse.mx, prevMouse.my, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
  return;
};

const drawTriangle = () => {
  ctx.beginPath();
  ctx.moveTo(prevMouse.mx, prevMouse.my);
  ctx.lineTo(mouse.mx, mouse.my);
  ctx.lineTo(prevMouse.mx * 2 - mouse.mx, mouse.my);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const draw = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapShot, 0, 0);
  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.fillStyle = selectedTool === "eraser" ? "#F8F8FF" : selectedColor;
    ctx.strokeStyle = selectedTool === "eraser" ? "#F8F8FF" : selectedColor;
    ctx.lineWidth = brushWidth;
    ctx.lineTo(mouse.mx, mouse.my);
    ctx.stroke();
  }
  if (selectedTool === "rectangle") {
    drawRectangle();
  }
  if (selectedTool === "circle") {
    drawCircle();
  }
  if (selectedTool === "triangle") {
    drawTriangle();
  }
};

toolbtns.forEach((tool) => {
  tool.addEventListener("click", () => {
    document.querySelectorAll(".option.tool").forEach((element) => {
      element.classList.remove("active");
    });
    tool.classList.add("active");
    selectedTool = tool.id;
    console.log(selectedTool);
  });
});

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));
colorBox.addEventListener("input", () => (selectedColor = colorBox.value));

clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});
saveImageBtn.addEventListener("click", () => {
  let link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

canvas.addEventListener("mousedown", enableDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", disableDraw);
