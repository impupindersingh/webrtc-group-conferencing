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

async function getAllDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) {
    console.log("enumerateDevices() is not supported by the browser.");
  } else {
    try {
      let devices = await navigator.mediaDevices.enumerateDevices();
      console.log(devices);
      devices.forEach((device, index) => {
        if (device.kind === "videoinput") {
          console.log(index, device);
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
}
async function updateCameraLocalStream() {
  try {
    const localStream = await navigator.mediaDevices.getUserMedia(
      mediaConstraints
    );
    videoCont.srcObject = localStream;
  } catch (err) {
    console.log("Error accessing camera: ", err);
  }
}

function switchCamera(deviceId) {
  mediaConstraints.video = { deviceId: { exact: deviceId } };
  updateCameraLocalStream();
}

function uuidv4() {
  return "xxyxyxxyx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

getAllDevices();
updateCameraLocalStream();

cameraDropdown.addEventListener("change", () => {
  const deviceIdOfSelectedCamera = cameraDropdown.value;
  switchCamera(deviceIdOfSelectedCamera);
});

const creatingRoomEffect = "Creating Room...";

createButton.addEventListener("click", (e) => {
  e.preventDefault();
  createButton.disabled = true;
  createButton.innerHTML = "Creating Room";
  createButton.classList = "createroom-clicked";

  setInterval(() => {
    if (createButton.innerHTML < creatingRoomEffect) {
      createButton.innerHTML = creatingRoomEffect.substring(
        0,
        createButton.innerHTML.length + 1
      );
    } else {
      createButton.innerHTML = creatingRoomEffect.substring(
        0,
        createButton.innerHTML.length - 3
      );
    }
  }, 500);
  // location.href = `/room.html?room=${uuidv4()}`;
});

joinButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (codeCont.value.trim() == "") {
    codeCont.classList.add("roomcode-error");
    return;
  }
  const code = codeCont.value;
  location.href = `/room.html?room=${code}`;
});

codeCont.addEventListener("change", () => {
  if (codeCont.value.trim() !== "") {
    codeCont.classList.remove("roomcode-error");
    return;
  }
});

cam.addEventListener("click", () => {
  if (camAllowed) {
    mediaConstraints = { video: false, audio: micAllowed ? true : false };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((localstream) => {
        videoCont.srcObject = localstream;
      });

    cam.classList = "nodevice";
    cam.innerHTML = `<i class="fas fa-video-slash"></i>`;
    camAllowed = 0;
  } else {
    mediaConstraints = { video: true, audio: micAllowed ? true : false };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((localstream) => {
        videoCont.srcObject = localstream;
      });

    cam.classList = "device";
    cam.innerHTML = `<i class="fas fa-video"></i>`;
    camAllowed = 1;
  }
});

mic.addEventListener("click", () => {
  if (micAllowed) {
    mediaConstraints = { video: camAllowed ? true : false, audio: false };
    updateCameraLocalStream();
    mic.classList = "nodevice";
    mic.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
    micAllowed = 0;
  } else {
    mediaConstraints = { video: camAllowed ? true : false, audio: true };
    mic.classList = "device";
    mic.innerHTML = `<i class="fas fa-microphone"></i>`;
    micAllowed = 1;
  }
});
