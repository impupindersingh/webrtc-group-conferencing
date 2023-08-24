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
  console.log({ mediaConstraints });

  updateCameraLocalStream();
}

getAllDevices();
updateCameraLocalStream();

cameraDropdown.addEventListener("change", () => {
  const deviceIdOfSelectedCamera = cameraDropdown.value;
  switchCamera(deviceIdOfSelectedCamera);
});
