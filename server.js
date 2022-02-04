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
  //emit object to be grabbed with socket.on() in main.js to be viewable only the one connecting
  socket.emit("message", "Welcome to Gamer Gabble");

  // Broadcast when user connects to everyone but user
  socket.broadcast.emit("message", "A user has joined the chat");

  // Run when client disconnects
  socket.on("disconnect", () => {
    // broadcast to everyone
    io.emit("message", " A user has left the chat");
  });

  // listen for ChatMessage to be submitted
  socket.on("chatMessage", (msg) => {
    // submit the message to everyone
    io.emit("message", msg);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
