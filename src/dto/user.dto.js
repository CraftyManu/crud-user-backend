import Joi from 'joi'

/* const checkUniqueUsername = async (value) => {
    console.log("🚀 ~ checkUniqueUsername user.dto.js")

    const userExists = await User.findOne({
        userName: value
    })

    if (userExists) {
        throw new Error('Ese "Nombre de Usuario" ya existe');
    }

    return value; // Return the value if validation passes
}; */


const createUserSchema = Joi.object({
    nombre: Joi.string().required(),
    apellido: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    fechaNacimiento: Joi.date().iso('Date must be in YYYY-MM-DD format ').required(),
    sexo: Joi.string().required(),
    telefono: Joi.string().required(), //+59, al empezar con el signo más deja de ser un número.
    direccion: Joi.string().required(),
    userName: Joi.string().required(),
    pais: Joi.string().required(),
    provincia: Joi.string().required(),
    localidad: Joi.string().required(),
    CP: Joi.number().required(),
})

const updateUserSchema = Joi.object({
    nombre: Joi.string(),
    apellido: Joi.string(),
    password: Joi.string().min(6),
    fechaNacimiento: Joi.date().iso('Date must be in YYYY-MM-DD format'),
    sexo: Joi.string(),
    telefono: Joi.string(), //+59, al empezar con el signo más deja de ser un número.
    direccion: Joi.string(),
    userName: Joi.string(),
    pais: Joi.string(),
    provincia: Joi.string(),
    localidad: Joi.string(),
    CP: Joi.number(),
})

const userParamsSchema = Joi.object({
    id: Joi.string().hex().length(24).required()
});

export {
    createUserSchema,
    updateUserSchema,
    userParamsSchema
}




/* // 3. Run the validation asynchronously
async function validateUser(userData) {
    try {
        const validatedData = await userSchema.validateAsync(userData);
        console.log("Validation successful:", validatedData);
    } catch (error) {
        console.error("Validation failed:", error.message);
    }
} */