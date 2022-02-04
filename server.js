const express = require("express");
const path = require("path");
//needed to run socket.io
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

// run when client connects
io.on("connection", (socket) => {
  console.log("new connection");

  //emit object to be grabbed with socket.on() in main.js
  socket.emit("message", "Welcome to Gamer Gabble");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
