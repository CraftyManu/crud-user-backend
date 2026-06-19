import {
    successResponse,
    errorResponse
} from "../helpers/response.helper.js"

import { loginService } from "../services/auth.service.js";

//podemos agregar un auth.dto que controle que los datos vengan bien

const login = async ( req, res, ) => {
    try {
        const response = await loginService(req.body);
        successResponse(res, response, "Login exitoso",);
    } catch (error) {
        errorResponse(res, error.message, error.statusCode,);
    }
};

export { login };