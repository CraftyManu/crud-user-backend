import { createUserSchema, updateUserSchema, userParamsSchema } from "../dto/user.dto.js";
import { getUsersService, createUserService, updateUserService, deleteUserService } from "../services/user.service.js";
import { successResponse, errorResponse, forbiddenResponse } from "../helpers/response.helper.js";

const getValidationMessage = (error, fallbackMessage) => {
  return error?.details?.[0]?.message || fallbackMessage;
};

const getUsers = async (req, res) => {
  console.log("🎮 CONTROLLER → getUsers");
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
    return successResponse(res, users, "Usuarios obtenidos correctamente");
  } catch (error) {
    if (error.statusCode === 403) {
      return forbiddenResponse(res, error.message || "Acceso denegado", error.errors || null);
    }
    /*     console.log('Error in user.controller.js getUsers', error)
     */ return errorResponse(res, error.message || "Error interno del servidor", error.statusCode || 500, error.errors || null);
  }
};

const createUser = async (req, res) => {
  try {
    console.log("🎮 CONTROLLER → createUser");
    //Validar DTO
    const { error, value } = createUserSchema.validate(req.body); //compara con el archivo dto, es un proceso rápido
    /* console.log('req.body:')
    console.log(req.body) */

    if (error) {
      const validationMessage = getValidationMessage(error, "Error de validación - hay un error en la data enviada");
      return errorResponse(res, validationMessage, 400, error.details);
    }
    const user = await createUserService(value); //es un proceso más lento, tiene que verificar contra el modelo, tiene que sacar la contraseña y encriptarla, guarda nuevo objeto con contraseña encriptada, puede verificar si el mail ya existe y luego guarda en la database...
    return successResponse(res, user, "Usuario creado correctamente", 201);
  } catch (error) {
    return errorResponse(res, error.message || "Error interno del servidoer", error.statusCode || 500, error.errors || null);
  }
};

const updateUser = async (req, res) => {
  try {
    const { error: paramsError } = userParamsSchema.validate(req.params);

    if (paramsError) {
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
      const validationMessage = getValidationMessage(error, "Error de validación");
      return errorResponse(res, validationMessage, 400, error.details);
    }

    const user = await updateUserService(req.params.id, req.body, {
      requesterRole: req.user?.role,
      requesterId: req.user?.userId,
    });

    return successResponse(res, user, "Usuario actualizado correctamente");
  } catch (error) {
    /*     console.log('error in updateUser from user.controller.js: ', error)
     */ return errorResponse(res, error.message || "Error interno del servidor", error.statusCode || 500, error.errors || null);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { error: paramsError } = userParamsSchema.validate(req.params);

    if (paramsError) {
      const validationMessage = getValidationMessage(paramsError, "Id inválido");
      return errorResponse(res, validationMessage, 400, paramsError.details);
    }

    const result = await deleteUserService(req.params.id, {
      requesterRole: req.user?.role,
      requesterId: req.user?.userId,
    });

    return successResponse(res, result, "Usuario eliminado correctamente");
  } catch (error) {
    return errorResponse(res, error.message || "Error interno del servidor", error.statusCode || 500, error.errors || null);
  }
};

export { getUsers, createUser, updateUser, deleteUser };
