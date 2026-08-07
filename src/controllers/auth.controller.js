import { successResponse, errorResponse } from "../helpers/response.helper.js";
import logger from "../helpers/logger.js";
import { loginService } from "../services/auth.service.js";

//podemos agregar un auth.dto que controle que los datos vengan bien

const login = async (req, res) => {
  const requestLogger = req.logger || logger;
  try {
    requestLogger.info("Intento de login", { email: req.body?.email });
    const response = await loginService(req.body);
    requestLogger.info("Login exitoso", { userId: response?.user?._id || response?.user?.id });
    successResponse(res, response, "Login exitoso");
  } catch (error) {
    requestLogger.error("Error en login", error);
    errorResponse(res, error.message, error.statusCode);
  }
};

export { login };
