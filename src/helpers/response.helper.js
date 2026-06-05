//Estandariza el formato de respuestas exitosas y de error
//Evita repetir res.status().json() en todos los controllers

export const successResponse = (
    res, 
    data = null,
    message = "Operacipon exitosa",
    statusCode = 200
) => {
    return res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        data,
    });
};

export const errorResponse = (
    res,
    message = "Error interno del servidor",
    statusCode = 500,
    errors = null
) => {
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
    });
};