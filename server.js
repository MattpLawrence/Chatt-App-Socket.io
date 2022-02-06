const express = require("express");
const path = require("path");
//needed to run socket.io
const http = require("http");
const socketio = require("socket.io");
const handlebars = require("express-handlebars");
const sequelize = require("./config/connection");
const hbs = handlebars.create({});
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// set handlebars as default template engine
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

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
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // SEND USER AND ROOM INFO
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // listen for ChatMessage to be submitted
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    // submit the message to everyone
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Run when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      // broadcast to everyone
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      // send user room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
