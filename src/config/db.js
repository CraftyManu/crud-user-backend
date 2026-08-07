import mongoose from "mongoose"; //importa todo

import { env } from "./env.js"; //importa solo la funcion dentro de { }
import logger from "../helpers/logger.js";

const connectDB = async () => {
  try {
    logger.info("🔄 Conectando MongoDB...");
    await mongoose.connect(env.MONGO_URI); //levanta la variable desde env
    logger.info("✔ Mongo conectado");
  } catch (error) {
    logger.error("❌ Error conectando MongoDB:", error);
  }
};

export default connectDB;
