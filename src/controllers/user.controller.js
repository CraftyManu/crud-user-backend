import {
    createUserSchema,
    updateUserSchema,
    userParamsSchema
} from "../dto/user.dto.js"

import {
    getUsersService,
    createUserService,
    updateUserService,
    deleteUserService
} from "../services/user.service.js"

import {
    successResponse,
    errorResponse
} from "../helpers/response.helper.js"

const getUsers = async (req, res) => {
    console.log('🎮 CONTROLLER → getUsers')
    try {
        /* const { email, id } = req.query; */
        //
        const { email } = req.query;
        const id = req.params?.id || req.query?.id;
        //

        const users = await getUsersService({
            email,
            id,
        });

        return successResponse(
            res,
            users,
            "Usuarios obtenidos correctamente"
        );

    } catch (error) {
        /* res.status(500).json({ error: error.message }) */
        return errorResponse(
            res,
            error.message || "Error interno del servidor",
            error.statusCode || 500,
            error.errors || null
        );
    }
};

const createUser = async (req, res) => {
    try {
        console.log('🎮 CONTROLLER → createUser')
        //Validar DTO
        const { error } = createUserSchema.validate(req.body) //compara con el archivo dto, es un proceso rápido
        if (error) {
            console.log("there's an error in the data sent to createUserSchema")
            return errorResponse(
                res,
                "Error de validación",
                400,
                error.details
            );
        }
        const user = await createUserService(req.body); //es un proceso más lento, tiene que verificar contra el modelo, tiene que sacar la contraseña y encriptarla, guarda nuevo objeto con contraseña encriptada, puede verificar si el mail ya existe y luego guarda en la database...
        return successResponse(
            res,
            user,
            "Usuario creado correctamente",
            201
        );
    } catch (error) {
        return errorResponse(
            res,
            error.message || "Error interno del servidoer",
            error.statusCode || 500,
            error.errors || null
        );
    }
};

const updateUser = async (req, res) => {
    try {
        const { error: paramsError } =
            userParamsSchema.validate(req.params);

        if (paramsError) {
            return errorResponse(
                res,
                "Id inválido",
                400,
                paramsError.details
            );
        }

        const { error } =
            updateUserSchema.validate(req.body);

        if (error) {
            return errorResponse(
                res,
                "Error de validación",
                400,
                error.details
            );
        }

        const user = await updateUserService(
            req.params.id,
            req.body
        );

        return successResponse(
            res,
            user,
            "Usuario actualizado correctamente"
        );
    } catch (error) {
        return errorResponse(
            res,
            error.message || "Error interno del servidor",
            error.statusCode || 500,
            error.errors || null
        );
    }
};

const deleteUser = async (req, res) => {
    try {
        const { error: paramsError } =
            userParamsSchema.validate(req.params);

        if (paramsError) {
            return errorResponse(
                res,
                "Id inválido",
                400,
                paramsError.details
            );
        }

        const result = await deleteUserService(
            req.params.id
        );

        return successResponse(
            res,
            result,
            "Usuario eliminado correctamente"
        );
    } catch (error) {
        return errorResponse(
            res,
            error.message || "Error interno del servidor",
            error.statusCode || 500,
            error.errors || null
        );
    }
};

export {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}