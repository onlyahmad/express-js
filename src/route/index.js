import express from "express";
import userRouter from "./userRouter.js";
import errorHandling from "../controllers/errorHandling.js";

const route = express.Router();

// Routes utama
route.use("/api", userRouter);

// 404 handler
route.use((req, res) => {
  res.status(404).json({
    errors: ["Not Found"],
    message: "The requested resource was not found",
    data: null,
  });
});

// Error handling (HARUS terakhir)
route.use(errorHandling);

export default route;
