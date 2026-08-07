import express from "express";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/user.controller.js"; // importamos todos los metodos que creamos en controllers
import { getSessionLogs } from "../controllers/sessionLog.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

//exponemos las rutas y las ejecutamos

/* router.get('/users', getUsers) */
router.get("/users", authMiddleware, authorizeRoles("ROOT", "ADMIN", "USER", "GUEST"), getUsers);
router.post("/users", authMiddleware, authorizeRoles("ROOT", "ADMIN"), createUser);
router.put("/users/:id", authMiddleware, authorizeRoles("ROOT", "ADMIN", "USER"), updateUser);
router.delete("/users/:id", authMiddleware, authorizeRoles("ROOT", "ADMIN"), deleteUser);

router.get("/users/:id", authMiddleware, authorizeRoles("ROOT", "ADMIN"), getUsers);
router.get("/sessions/:id/logs", authMiddleware, getSessionLogs);

export default router;
