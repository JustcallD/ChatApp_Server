import express from "express";
import {
  loginController,
  SignUpController,
} from "../Controllers/Auth.Controller.js";

const AuthRoutes = express.Router();

AuthRoutes.post("/sign-up", SignUpController);
AuthRoutes.post("/login", loginController);
// AuthRoutes.post("/logout", logoutController);

export { AuthRoutes };
