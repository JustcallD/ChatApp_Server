import { Server } from "socket.io";
import { handleUserToUserChat } from "./UserToUser.Socket.js";
import { addUser, removeUser, users } from "./users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// console.log(process.env.ALLOWED_ORIGIN);

const initializeSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ALLOWED_ORIGIN,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const accessToken = socket.request.headers.cookie;
      if (!accessToken) {
        throw new Error("Authentication error: Access token missing");
      }

      const cookie = accessToken.split("=")[1];
      const decoded = jwt.verify(cookie, process.env.ACCESS_TOKEN_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      console.error("Socket authentication error:", err.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    try {
      addUser(socket.user._id, socket.id);
      console.log("New client connected:", socket.user._id);
      socket.join(socket.user._id);

      handleUserToUserChat(io, socket);

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.user._id);
        removeUser(socket.user._id);
        console.log("Updated users list:", users);
      });
    } catch (error) {
      console.error("Connection error:", error);
    }
  });
};

export { initializeSocketServer };
