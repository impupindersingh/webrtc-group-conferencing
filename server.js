const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const moment = require("moment");
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
// Using the server instance
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

let rooms = {};
let socketroom = {};
let socketname = {};
let micSocket = {};
let videoSocket = {};

io.on("connect", (socket) => {
  socket.on("join room", (roomid, username) => {
    socket.join(roomid);
    socketroom[socket.id] = roomid;
    socketname[socket.id] = username;
    micSocket[socket.id] = "on";
    videoSocket[socket.id] = "on";

    if (rooms[roomid] && rooms[roomid].length > 0) {
      rooms[roomid].push(socket.id);
      socket
        .to(roomid)
        .emit(
          "message",
          `${username} joined the room.`,
          "Bot",
          moment().format("h:mm a")
        );
      io.to(socket.id).emit(
        "join room",
        rooms[roomid].filter((pid) => pid != socket.id),
        socketname,
        micSocket,
        videoSocket
      );
    } else {
      rooms[roomid] = [socket.id];
      io.to(socket.id).emit("join room", null, null, null, null);
    }

    io.to(roomid).emit("user count", rooms[roomid].length);
  });

  socket.on("action", (msg) => {
    if (msg == "mute") micSocket[socket.id] = "off";
    else if (msg == "unmute") micSocket[socket.id] = "on";
    else if (msg == "videoon") videoSocket[socket.id] = "on";
    else if (msg == "videooff") videoSocket[socket.id] = "off";

    socket.to(socketroom[socket.id]).emit("action", msg, socket.id);
  });
});
server.listen(PORT, () =>
  console.log(`Server is up and running on port ${PORT}`)
);
