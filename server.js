require("dotenv").config();
require("./Config/DB_Config");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app);
app.use(
  cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  })
);
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN_URL,
  },
});
let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("Client connected: " + socket.id);

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // socket.on("send_message", (data) => {
  //   console.log("sender id: " + socket.id);

  //   const receiverData = getUser(data.receiver);
  //   const toSocket = receiverData.socketId;
  //   console.log("receiver", receiverData.socketId);
  //   if (toSocket) {
  //     console.log("receiverSocketId", toSocket);

  //     io.to(socket.id).emit("receive_message", data);

  //     io.to(toSocket).emit("receive_message", data);
  //   } else {
  //     console.log(`User ${data.receiver} is not currently connected.`);
  //   }
  // });
  socket.on("send_message", (data) => {
    console.log("sender id: " + socket.id);

    const receiverData = getUser(data.receiver);
    const toSocket = receiverData ? receiverData.socketId : null;

    console.log("receiver", toSocket);

    if (toSocket) {
      console.log("receiverSocketId", toSocket);

      // Emit the message to the sender
      io.to(socket.id).emit("receive_message", data);

      // Emit the message to the receiver
      io.to(toSocket).emit("receive_message", data);
    } else {
      io.to(socket.id).emit("receive_message", data);
      console.log(`User ${data.receiver} is not currently connected.`);

      // Handle the case where the receiver is not connected
      io.to(socket.id).emit("error", {
        message: `User ${data.receiver} is not currently connected.`,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
    removeUser(socket.id);
  });
});
const Auth = require("./Routes/Auth.routes");
app.use("/", Auth);
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`App listening on port http://localhost:${PORT}`)
);
