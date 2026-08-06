import Joi from "joi";

const roles = ["ROOT", "ADMIN", "USER", "GUEST"];
const genero = ["Femenino", "Masculino", "Otro"];

const createUserSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'El nombre debe ser texto válido.',
    'string.empty': 'El nombre no puede estar vacio.',
    'string.min': 'El nombre debe contener al menos 2 caracteres.',
    'any.required': 'Debes ingresar tu nombre.'
  }),
  apellido: Joi.string().trim().min(2).max(100).required().messages({
    'string.base': 'El apellido debe ser texto válido.',
    'string.empty': 'El apellido no puede estar vacio.',
    'string.min': 'El apellido debe contener al menos 2 caracteres.',
    'any.required': 'Debes ingresar tu apellido.'
  }),
  email: Joi.string().trim().email().required().messages({
    'string.email': 'Por favor ingresa una dirección de email válida.',
    'any.required': 'Debes ingresar un email.'
  }),
  password: Joi.string().min(6).max(50).required().messages({
    'any.required': 'Debes ingresar una congraseña',
    'string.min': 'La contraseña debe contener al menos 6 caracteres.'
  }),
  fechaNacimiento: Joi.date().iso("Date must be in YYYY-MM-DD format").required().messages({
    "date.base": "La fecha de nacimiento ingresada debe ser una fecha válida",
    "date.format": "La fecha de nacimiento debe estar en formato AAAA-MM-DD",
  }),
  edad: Joi.number().integer().min(1).max(120).messages({
    //not required -> la calculo en functions/dao
    "number.base": "La edad debe ser numérica",
    "number.integer": "La edad debe ser un número entero",
    "number.min": "La edad debe ser mayor a 0",
    "number.max": "La edad no puede ser mayor a 120",
  }),
  genero: Joi.string()
    .trim()
    .valid(...genero)
    .required()
    .messages({ "any.only": `El género debe ser uno de los siguientes: ${genero.join(", ")}` }),
  telefono: Joi.string().trim().min(6).max(20).required(), //+59, al empezar con el signo más (+) deja de ser un número.
  direccion: Joi.string().trim().max(200).required(),
  localidad: Joi.string().trim().max(100).required(),
  provincia: Joi.string().trim().max(100).required(),
  pais: Joi.string().trim().max(100).required(),
  codigoPostal: Joi.string().trim().max(20).required(),
  role: Joi.string()
    .valid(...roles) /* .default("USER") */
    .messages({ "any.only": `El rol debe ser uno de los siguientes: ${roles.join(", ")}` }),
  userName: Joi.string().trim().min(2).max(100),
  avatarURL: Joi.string().trim(),
});

const updateUserSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).messages({
    'string.base': 'El nombre debe ser texto válido.',
    'string.empty': 'El nombre no puede estar vacio.',
    'string.min': 'El nombre debe contener al menos 2 caracteres.',
    'any.required': 'El nombre es un campo requerido.'
  }),
  apellido: Joi.string().trim().min(2).max(100).messages({
    'string.base': 'El apellido debe ser texto válido.',
    'string.empty': 'El apellido no puede estar vacio.',
    'string.min': 'El apellido debe contener al menos 2 caracteres.',
    'any.required': 'El apellido es un campo requerido.'
  }),
  //Se permite recibirlo para devolver un mensaje amigable desde el service indicando que no puede modificarse
  email: Joi.string().trim().email(),
  password: Joi.string().min(6).max(50),
  fechaNacimiento: Joi.date().iso("Date must be in YYYY-MM-DD format").messages({
    "date.base": "La fecha de nacimiento ingresada debe ser una fecha válida",
    "date.format": "La fecha de nacimiento debe estar en formato AAAA-MM-DD",
  }),
  edad: Joi.number().integer().min(1).max(120).messages({
    "number.base": "La edad debe ser numérica",
    "number.integer": "La edad debe ser un número entero",
    "number.min": "La edad debe ser mayor a 0",
    "number.max": "La edad no puede ser mayor a 120",
  }),
  genero: Joi.string().trim(),
  telefono: Joi.string().trim().min(6).max(20), //+59, al empezar con el signo más deja de ser un número.
  direccion: Joi.string().trim().max(200),
  localidad: Joi.string().trim().max(100),
  provincia: Joi.string().trim().max(100),
  pais: Joi.string().trim().max(100),
  codigoPostal: Joi.string().trim().max(20),
  role: Joi.string()
    .valid(...roles)
    .messages({ "any.only": `El rol debe ser uno de los siguientes: ${roles.join(", ")}` }),
  userName: Joi.string().trim().min(2).max(100),
  avatarURL: Joi.string().allow("").optional().trim(),
});

const userParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "El id debe ser un ObjectId válido",
    "string.length": "El id debe tener 24 caracteres",
    "any.required": "El id es obligatorio",
  }),
});

export { createUserSchema, updateUserSchema, userParamsSchema };
