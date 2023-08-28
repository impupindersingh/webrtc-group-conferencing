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
//whiteboard js start
const whiteboardCont = document.querySelector(".whiteboard-cont");
const canvas = document.querySelector("#whiteboard");
const ctx = canvas.getContext("2d");

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

continueButt.addEventListener("click", () => {
  if (nameField.value === "") return;
  username = nameField.value;
  overlayContainer.style.visibility = "hidden";
  document.querySelector("#name").innerHTML = `${username} (You)`;
  socket.emit("join room", roomid, username);
});

nameField.addEventListener("keyup", (event) => {
  event.preventDefault();
  if (event.keycode === 13) {
    // i.e. enter key
    continueButt.click();
  }
});
