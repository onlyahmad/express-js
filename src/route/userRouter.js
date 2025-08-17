import express from "express";
import UserController from "../controllers/userController.js";

const userRouter = express.Router();

// Endpoints User
userRouter.post("/users", UserController.setUser);
userRouter.post("/users/login", UserController.setLogin);
userRouter.get("/users/refresh-token", UserController.refreshToken);

export default userRouter;
