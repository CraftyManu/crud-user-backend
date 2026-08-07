import express from "express";
import "./config/env.js";
import connectDB from "./config/db.js";
import corsConfig from "./config/cors.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { rateLimiter } from "./middlewares/rateLimit.middleware.js";
import requestLogger from "./middlewares/requestLogger.middleware.js";
import requestContextMiddleware from "./middlewares/requestContext.middleware.js";
import logger from "./helpers/logger.js";

const app = express(); //levanta el backend como función
app.set("trust proxy", 1);
app.use(corsConfig);
app.use(express.json()); //para poder usar json desde el body
app.use(rateLimiter);
app.use(requestLogger);
app.use(requestContextMiddleware);
connectDB(); //llamar a la base de datos

//llamar a las rutas
app.use(userRoutes); //ruta de usuarios
app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  logger.info(`🚀 Servidor corriendo en puerto ${process.env.PORT} 🚢`);
});
