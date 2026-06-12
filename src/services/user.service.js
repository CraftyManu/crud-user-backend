// esta es la última capa?
import bcrypt from "bcryptjs"
import User from '../models/user.model.js'
import Audit from '../models/audit.model.js' //models va a llamar a la database, por eso no necesito importarla en este archivo
import mongoose from "mongoose" //to validate id
/* import { checkUniqueUsername } from "../dto/user.dto.js" */
import calculateAge from "../dao/functions/dao.users.js"

const getUsersService = async ({ email, id }) => {
    try {
        console.log('SERVICE → getUsersService')
        // buscar por ID
        if (id) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw {
                    statusCode: 400,
                    message: "Id inválido"
                };
            }

            const user = await User.findById(id).select('-password') //no tiene que devolver el password!
            /* const users = await User.find().select('-password')*/ //no tiene que devolver el password!

            if (!user) {
                throw {
                    statusCode: 404,
                    message: "Usuario no encontrado"
                }
            }

            /* return user; */
            console.log("🚀 ~ getUsersService ~ calculateAge:")
            const usersWithAge = await calculateAge(user);
            return usersWithAge;
        }

        //Buscar por email

        if (email) {
            const user = await User.findOne({ email }).select("-password");

            if (!user) {
                throw {
                    statusCode: 404,
                    message: "Usuario no encontrado"
                }
            }

            /* return user */
            const usersWithAge = await calculateAge(user)
            console.log("🚀 ~ getUsersService ~ calculateAge:")
            return usersWithAge
        }
        //Todos los usuarios
        return await (await User.find().select("-password")).sort({ nombre: 1 });


    } catch (error) {
        throw {
            statusCode: error.statusCode || 500,
            message: error.message || "Error interno del servidor",
            errors: error.errors || null,
        };
    };
    /* console.log("🚀 ~ getUsersService ~ calculateAge:")
console.log(usersWithAge) */
    console.log('---')
    /* return usersWithAge */
}

const createUserService = async (data) => {
    console.log('SERVICE → createUserService')

    try {
        const existUser = await User.findOne({
            email: data.email,
        })

        if (existUser) {
            throw {
                statusCode: 400,
                message: "El usuario ya existe",
            };
        }

        const hashedPassword = await bcrypt.hash(
            data.password,
            10
        )

        const user = new User({
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            password: hashedPassword,
            fechaNacimiento: data.fechaNacimiento,
            edad: data.edad,
            genero: data.genero,
            telefono: data.telefono,
            direccion: data.direccion,
            localidad: data.localidad,
            provincia: data.provincia,
            pais: data.pais,
            codigoPostal: data.codigoPostal,
            userName: data.userName
        })

        await user.save()

        return {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            fechaNacimiento: user.fechaNacimiento,
            edad: user.edad,
            genero: user.genero,
            telefono: user.telefono,
            direccion: user.direccion,
            localidad: user.localidad,
            provincia: user.provincia,
            pais: user.pais,
            codigoPostal: user.codigoPostal,
            userName: user.userName
        }; // desgloso el objeto para asegurarme de que no se envía la contraseña

        /* const [savedUserWithAge] = await calculateAge({user});
        console.log("🚀 ~ createUserService ~ savedUserWithAge:", savedUserWithAge)
        return savedUserWithAge */
    } catch (error) {
        console.error("❌ Error en createUserService", error);
        throw {
            statusCode: error.statusCode || 500,
            message: error.message || "Error interno del servidor",
            errors: error.errors || null
        }
    }
}

const updateUserService = async (id, data) => { //Updates a user's information by their ID. @param {Object} data - The fields to update for the user.
    console.log('SERVICE → updateUserService')
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw {
                statusCode: 400,
                message: "Id inválido"
            };
        } //@throws {Error} If the user is not found or if validation fails.

        const user = await User.findById(id) // ← Returns null if invalid/not found

        if (!user) {
            throw {
                statusCode: 400,
                message: "Usuario no encontrado"
            }
        }

        //El eamil existe pero no es modificable
        if (data.email !== undefined) {
            throw {
                statusCode: 400,
                message: "El email no puede modificarse"
            };
        }
        // Si otro usuario ya tiene ese userName, informar que el nombre de usuario ya existe:
        /* if () {
            throw {
                statusCode: 400,
                message: "El nombre de usuario ya existe"
            };
        } */

        const allowedFields = [
            "nombre",
            "apellido",
            "fechaNacimiento",
            "edad",
            "genero",
            "telefono",
            "direccion",
            "localidad",
            "provincia",
            "pais",
            "codigoPostal",
            "userName"
        ];

        allowedFields.forEach((field) => {
            if (data[field] !== undefined) {
                user[field] = data[field];
            }
        });

        //Cambiar password si viene informada
        if (data.password !== undefined) {
            user.password = await bcrypt.hash(
                data.password,
                10
            );
        }

        await user.save()

        return {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            fechaNacimiento: user.fechaNacimiento,
            edad: user.edad,
            genero: user.genero,
            telefono: user.telefono,
            direccion: user.direccion,
            localidad: user.localidad,
            provincia: user.provincia,
            pais: user.pais,
            codigoPostal: user.codigoPostal,
            userName: user.userName
        };
        /* const [updatedUserWithAge] = await calculateAge([user])
        return updatedUserWithAge */ // @returns {Promise<Object>} The updated user object with calculated age.
    } catch (error) {
        console.error (
            "❌ Error en updateUserService:", error
        );

        throw {
            statusCode: error.statusCode || 500,
            message: error.message || "Error interno del servidor",
            errors: error.errors || null,
        };
    }
}

const deleteUserService = async (id) => {
    try {
        console.log('SERVICE → deleteUserService')
        console.log(id)

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Usuario no encontrado')
        }
        const user = await User.findById(id)

        //AUDITORIA
        await Audit.create({
            usuarioEliminado: user
        })

        await User.findByIdAndDelete(id)

        return {
            mesage: 'Usuario eliminado'
        }
        console.log('---')
    } catch (error) {
        throw error
    }
}

export {
    getUsersService,
    createUserService,
    updateUserService,
    deleteUserService
}