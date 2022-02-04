const express = require("express");
const path = require("path");
//needed to run socket.io
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const botName = "GammerGabble Bot";

// run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //emit object to be grabbed with socket.on() in main.js to be viewable only the one connecting
    socket.emit("message", formatMessage(botName, "Welcome to Gamer Gabble"));

    // Broadcast when user connects to everyone but user in the room
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(botName, "A user has joined the chat"));
  });

  // listen for ChatMessage to be submitted
  socket.on("chatMessage", (msg) => {
    // submit the message to everyone
    io.emit("message", formatMessage("user", msg));
  });

  // Run when client disconnects
  socket.on("disconnect", () => {
    // broadcast to everyone
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
