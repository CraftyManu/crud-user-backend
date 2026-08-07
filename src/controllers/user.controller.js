import { createUserSchema, updateUserSchema, userParamsSchema } from "../dto/user.dto.js";
import { getUsersService, createUserService, updateUserService, deleteUserService } from "../services/user.service.js";
import { successResponse, errorResponse, forbiddenResponse } from "../helpers/response.helper.js";
import logger from "../helpers/logger.js";

const getValidationMessage = (error, fallbackMessage) => {
  return error?.details?.[0]?.message || fallbackMessage;
};

const getUsers = async (req, res) => {
  const requestLogger = req.logger || logger;
  requestLogger.info("🎮 CONTROLLER → getUsers", { user: req.user?.userId || "anonymous", query: req.query });
  try {
    /* const { email, id } = req.query; */
    //
    const { email } = req.query;
    const id = req.params?.id || req.query?.id;
    //

    const users = await getUsersService({
      email,
      id,
      requesterRole: req.user?.role, //operador ternario, si no lee el dato lo convierte en undefined? en vez de null
      requesterId: req.user?.userId,
    });
    /*     console.log(`getUsers in user.controller.js: Usuarios obtenidos correctamente`)
        console.log(`users.nombre: ${users.nombre}`)
        console.log(`requesterRole`, users.requesterRole) */
    requestLogger.info("Usuarios obtenidos correctamente", { count: Array.isArray(users) ? users.length : 0 });
    return successResponse(res, users, "Usuarios obtenidos correctamente");
  } catch (error) {
    requestLogger.error("Error al obtener usuarios", error);
    if (error.statusCode === 403) {
      return forbiddenResponse(res, error.message || "Acceso denegado", error.errors || null);
    }
    return errorResponse(res, error.message || "Error interno del servidor", error.statusCode || 500, error.errors || null);
  }
};

const createUser = async (req, res) => {
  const requestLogger = req.logger || logger;
  try {
    requestLogger.info("🎮 CONTROLLER → createUser", { email: req.body?.email });
    //Validar DTO
    const { error, value } = createUserSchema.validate(req.body); //compara con el archivo dto, es un proceso rápido
    /* console.log('req.body:')
    console.log(req.body) */

    if (error) {
      requestLogger.warn("Validación fallida al crear usuario", error.details || error.message);
      const validationMessage = getValidationMessage(error, "Error de validación - hay un error en la data enviada");
      return errorResponse(res, validationMessage, 400, error.details);
    }
    const user = await createUserService(value); //es un proceso más lento, tiene que verificar contra el modelo, tiene que sacar la contraseña y encriptarla, guarda nuevo objeto con contraseña encriptada, puede verificar si el mail ya existe y luego guarda en la database...
    requestLogger.info("Usuario creado correctamente", { userId: user?._id || user?.id });
    return successResponse(res, user, "Usuario creado correctamente", 201);
  } catch (error) {
    requestLogger.error("Error al crear usuario", error);
    return errorResponse(res, error.message || "Error interno del servidoer", error.statusCode || 500, error.errors || null);
  }
};

const updateUser = async (req, res) => {
  const requestLogger = req.logger || logger;
  try {
    requestLogger.info("🎮 CONTROLLER → updateUser", { userId: req.params.id });
    const { error: paramsError } = userParamsSchema.validate(req.params);

    if (paramsError) {
      requestLogger.warn("Parámetros inválidos al actualizar usuario", paramsError.details || paramsError.message);
      const validationMessage = getValidationMessage(paramsError, "Id inválido");
      return errorResponse(res, validationMessage, 400, paramsError.details);
    }

    /*  console.log('req.body')
    console.log(req.body) */

    // Remove immutable or database-generated fields sent by clients (like _id)
    // so Joi validation doesn't fail with "_id is not allowed".
    if (req.body && Object.prototype.hasOwnProperty.call(req.body, "_id")) {
      delete req.body._id;
    }

    const { error } = updateUserSchema.validate(req.body);

    if (error) {
      requestLogger.warn("Validación fallida al actualizar usuario", error.details || error.message);
      const validationMessage = getValidationMessage(error, "Error de validación");
      return errorResponse(res, validationMessage, 400, error.details);
    }

    const user = await updateUserService(req.params.id, req.body, {
      requesterRole: req.user?.role,
      requesterId: req.user?.userId,
    });

    requestLogger.info("Usuario actualizado correctamente", { userId: req.params.id });
    return successResponse(res, user, "Usuario actualizado correctamente");
  } catch (error) {
    requestLogger.error("Error al actualizar usuario", error);
    return errorResponse(res, error.message || "Error interno del servidor", error.statusCode || 500, error.errors || null);
  }
};

const deleteUser = async (req, res) => {
  const requestLogger = req.logger || logger;
  try {
    requestLogger.info("🎮 CONTROLLER → deleteUser", { userId: req.params.id });
    const { error: paramsError } = userParamsSchema.validate(req.params);

    if (paramsError) {
      requestLogger.warn("Parámetros inválidos al eliminar usuario", paramsError.details || paramsError.message);
      const validationMessage = getValidationMessage(paramsError, "Id inválido");
      return errorResponse(res, validationMessage, 400, paramsError.details);
    }

    const result = await deleteUserService(req.params.id, {
      requesterRole: req.user?.role,
      requesterId: req.user?.userId,
    });

    requestLogger.info("Usuario eliminado correctamente", { userId: req.params.id });
    return successResponse(res, result, "Usuario eliminado correctamente");
  } catch (error) {
    requestLogger.error("Error al eliminar usuario", error);
    return errorResponse(res, error.message || "Error interno del servidor", error.statusCode || 500, error.errors || null);
  }
};

export { getUsers, createUser, updateUser, deleteUser };
