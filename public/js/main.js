const chatForm = document.getElementById("chat-form");

const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

// massage submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // grab the value of the message when submitted
  const msg = e.target.elements.msg.value;

  // emit the submitted massage to the server
  socket.emit("chatMessage", msg);
});
