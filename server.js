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

server.listen(PORT, () =>
  console.log(`Server is up and running on port ${PORT}`)
);
