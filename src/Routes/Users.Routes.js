import { AllUserController } from "../Controllers/User.Controller.js";
import express from "express";
import { authenticate } from "../Middlewares/Authentication.Middleware.js";
import { AllMessageController } from "../Controllers/Message.Controller.js";

const UsersRoutes = express.Router();

UsersRoutes.get("/all-users", authenticate, AllUserController);
UsersRoutes.get("/get-messages/:receiverId", authenticate, AllMessageController);
// UsersRoutes.post("/login", loginController);
// AuthRoutes.post("/logout", logoutController);

export { UsersRoutes };
