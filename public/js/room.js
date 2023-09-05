const socket = io();
const myvideo1 = document.querySelector("#vd1");
const myvideo2 = document.querySelector("#vd2");
const myvideo3 = document.querySelector("#vd3");
let videoFream = 1;
const roomid = params.get("room");
let username;
const chatRoom = document.querySelector(".chat-cont");
const sendButton = document.querySelector(".chat-send");
const messageField = document.querySelector(".chat-input");
const videoContainer = document.querySelector("#vcont");
const overlayContainer = document.querySelector("#overlay");
const continueButt = document.querySelector(".continue-name");
const nameField = document.querySelector("#name-field");
const videoButt = document.querySelector(".novideo");
const audioButt = document.querySelector(".audio");
const cutCall = document.querySelector(".cutcall");
const screenShareButt = document.querySelector(".screenshare");
const whiteboardButt = document.querySelector(".board-icon");
const cameraDropdown = document.getElementById("camera-select");
cameraDropdown.innerHTML = "";

continueButt.addEventListener("click", () => {
  if (nameField.value === "") return;
  username = nameField.value;
  overlayContainer.style.visibility = "hidden";
  document.querySelector("#name").innerHTML = `${username} (You)`;
  socket.emit("join room", roomid, username);
});

nameField.addEventListener("keyup", (event) => {
  event.preventDefault();
  if (event.keyCode === 13) {
    // i.e. enter key
    continueButt.click();
  }
});

let videoAllowed = 1;
let audioAllowed = 1;
let micInfo = {};
let videoInfo = {};
let videoTrackReceived = {};
let mediaConstraints = { video: true, audio: true };

let mymuteicon = document.querySelector("#mymuteicon");
let myvideooff = document.querySelector("#myvideooff");

mymuteicon.style.visibility = "hidden";
myvideooff.style.visibility = "hidden";

const configuration = { iceServers: [{ urls: "stun:stun.stunprotocol.org" }] };

let connections = {};
let cName = {};
let audioTrackSent = {};
let videoTrackSent = {};

let myStream, myscreenshare;

document.querySelector(".roomcode").innerHTML = `${roomid}`;
let videoDevices = [];

(async function getAllDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) {
    console.log("enumerateDevices() is not supported by the browser.");
  } else {
    try {
      let devices = await navigator.mediaDevices.enumerateDevices();
      devices.forEach((device, index) => {
        if (device.kind === "videoinput") {
          videoDevices.push(device);
          const option = document.createElement("option");
          option.value = device.deviceId;
          option.text = device.label || `Camera ${cameraDropdown.length + 1}`;
          cameraDropdown.appendChild(option);
        }
      });
    } catch (err) {
      console.error(`${err.name}: ${err.message}`);
    }
  }
})();

function CopyClassText() {
  let textToCopy = document.querySelector(".roomcode");
  let currentRange;
  if (document.getSelection().rangeCount > 0) {
    currentRange = document.getSelection().getRangeAt(0);
    window.getSelection().removeRange(currentRange);
  } else {
    currentRange = false;
  }

  let copyRange = document.createRange();
  copyRange.selectNode(textToCopy);
  window.getSelection().addRange(copyRange);
  document.execCommand("copy");
  window.getSelection().removeRange(copyRange);

  if (currentRange) {
    window.getSelection().addRange(currentRange);
  }

  document.querySelector(".copycode-button").textContent = "Copied!";
  setTimeout(() => {
    document.querySelector(".copycode-button").textContent = "Copy Code";
  }, 5000);
}

//whiteboard js start
const whiteboardCont = document.querySelector(".whiteboard-cont");
const canvas = document.querySelector("#whiteboard");
const ctx = canvas.getContext("2d");

whiteboardCont.style.visibility = "hidden";
let boardVisible = false;
let isDrawing = 0;
let x = 0;
let y = 0;
let color = "black";
let drawSize = 3;
let colorRemote = "black";
let drawSizeRemote = 3;

function fitToContainer(canvas) {
  canvas.style.width = "100%";
  canvas.style.height = "100%";
}

fitToContainer(canvas);
socket.on("getCanvas", (url) => {
  let img = new Image();
  img.onload = start;
  img.src = url;

  function start() {
    ctx.drawImage(img, 0, 0);
  }

  console.log("got canvas", url);
});

function setColor(newcolor) {
  color = newcolor;
  drawsize = 3;
}

function setEraser() {
  color = "white";
  drawsize = 10;
}

//might remove this
function reportWindowSize() {
  fitToContainer(canvas);
}

window.onresize = reportWindowSize;
//

function clearBoard() {
  if (
    window.confirm(
      "Are you sure you want to clear board? This cannot be undone"
    )
  ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("store canvas", canvas.toDataURL());
    socket.emit("clearBoard");
  } else return;
}

socket.on("clearBoard", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function draw(newx, newy, oldx, oldy) {
  ctx.strokeStyle = color;
  ctx.lineWidth = drawsize;
  ctx.beginPath();
  ctx.moveTo(oldx, oldy);
  ctx.lineTo(newx, newy);
  ctx.stroke();
  ctx.closePath();

  socket.emit("store canvas", canvas.toDataURL());
}

function drawRemote(newx, newy, oldx, oldy) {
  ctx.strokeStyle = colorRemote;
  ctx.lineWidth = drawsizeRemote;
  ctx.beginPath();
  ctx.moveTo(oldx, oldy);
  ctx.lineTo(newx, newy);
  ctx.stroke();
  ctx.closePath();
}

canvas.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = 1;
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    draw(e.offsetX, e.offsetY, x, y);
    socket.emit("draw", e.offsetX, e.offsetY, x, y, color, drawsize);
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener("mouseup", (e) => {
  if (isDrawing) {
    isDrawing = 0;
  }
});

socket.on("draw", (newX, newY, prevX, prevY, color, size) => {
  colorRemote = color;
  drawsizeRemote = size;
  drawRemote(newX, newY, prevX, prevY);
});

//whiteboard js end
