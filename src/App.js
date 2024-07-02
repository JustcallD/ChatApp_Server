import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { initializeSocketServer } from "./Sockets/SocketServer.js";

const App = express();

// Middlewares
App.use(express.json());
App.use(express.urlencoded({ extended: true }));

App.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);
App.use(cookieParser());

// Apis
import { AuthRoutes } from "./Routes/Auth.Routes.js";
import { UsersRoutes } from "./Routes/Users.Routes.js";
App.use("/api/v1", AuthRoutes);
App.use("/api/v1", UsersRoutes);

// Socket server
const Server = new createServer(App);
initializeSocketServer(Server);
export default Server;
