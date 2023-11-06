require("dotenv").config();
require("./Config/DB_Config");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://chat-app-client-theta-sepia.vercel.app",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected: " + socket.id);

  // Handle chat message events from the frontend
  socket.on("send_message", (message) => {
    // Broadcast the message to all connected clients, including the sender
    io.emit("chat message", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected: " + socket.id);
  });
});

app.get("/", (req, res) => res.send("Hello World!"));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`App listening on port http://localhost:${PORT}`)
);
