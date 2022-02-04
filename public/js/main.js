const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const socket = io();

//Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //  scroll down after each message received
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// massage submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // grab the value of the message when submitted
  const msg = e.target.elements.msg.value;

  // emit the submitted massage to the server
  socket.emit("chatMessage", msg);

  // clear the input
  e.target.elements.msg.value = "";
  // focus back on input to be ready for next message
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
  <p class="meta">Brad <span>9:12pm</span></p>
  <p class="text">
    ${message}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
