import express from "express";
import { login } from "../controllers/auth.controller.js"; // importamos todos los metodos que creamos en controllers
import { bruteForceMiddleware } from "../middlewares/bruteForce.middleware.js";

const router = express.Router();

router.post("/login", bruteForceMiddleware, login);

export default router;
