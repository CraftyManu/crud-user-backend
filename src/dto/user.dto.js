import Joi from 'joi'

const createUserSchema = Joi.object({
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    edad: Joi.number().required(),
    sexo: Joi.string().required(),
    telefono: Joi.string().required(), //+59, al empezar con el signo más deja de ser un número.
    direccion: Joi.string().required(),
})

const updateUserSchema = Joi.object({
    nombre: Joi.string(),
    apellido: Joi.string(),
    password: Joi.string().min(6),
    edad: Joi.number(),
    sexo: Joi.string(),
    telefono: Joi.string(), //+59, al empezar con el signo más deja de ser un número.
    direccion: Joi.string(),
})

export {
    createUserSchema,
    updateUserSchema
}