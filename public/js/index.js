const createButton = document.querySelector(".createroom");
const videoCont = document.querySelector(".video-self");
const codeCont = document.querySelector(".roomcode");
const joinButton = document.querySelector(".joinroom");
const mic = document.querySelector(".mic");
const cam = document.querySelector(".webcam");
const cameraDropdown = document.querySelector(".camera-select");
cameraDropdown.innerHTML = "";

let micAllowed = 1;
let camAllowed = 1;
let videoDevices = [];
let mediaConstraints = { video: true, audio: true };

