import express from "express";
import route from "../route/index.js";
import "./winston.js"

// ganti express() jadi Router()
const appMiddleware = express.Router();

// body parser JSON
appMiddleware.use(express.json());

// routes
appMiddleware.use(route);

export default appMiddleware;
