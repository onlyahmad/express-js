import express from "express";
import route from "../route/index.js";
import cors from "cors";

const router = express.Router();

// body parser JSON & URL-encoded
router.use(
  cors({
    origin: "*", // Allow all origins, adjust as needed
    Credential: true,
    preflightContinue: false,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow only specific methods
  })
);
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// routes
router.use(route);

export default router;
