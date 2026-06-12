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
        const { email, id } = req.query;
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
}

const updateUser = async (req, res) => {
    try {
        console.log('🎮 CONTROLLER → updateUser')
        //Validar DTO
        const { error: paramsError } = userParamsSchema.validate(req.params)
        console.log('updateUser - error', paramsError)

        if (paramsError) {
            return res.status(400).json({
                message: "ID invalido"
            })
        }

        const { error } = updateUserSchema.validate(req.body)
        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            })
        }

        const user = await updateUserService(
            req.params.id,
            req.body
        )
        res.json(user)
        console.log('user: ')
        console.log(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        console.log('🎮 CONTROLLER → deleteUser')
        //Validar DTO
        const { error: paramsError } = userParamsSchema.validate(req.params)
        console.log('updateUser - error', paramsError)

        if (paramsError) {
            return res.status(400).json({
                message: "ID invalido"
            })
        }

        const result = await deleteUserService(req.params.id)
        res.json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}