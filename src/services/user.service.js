// esta es la última capa?
import bcrypt from "bcryptjs"
import User from '../models/user.model.js'
import Audit from '../models/audit.model.js' //models va a llamar a la database, por eso no necesito importarla en este archivo
import calculateAge from "../dao/functions/dao.users.js"
import mongoose from "mongoose" //to validate id
/* import { checkUniqueUsername } from "../dto/user.dto.js"
 */

const getUsersService = async () => {
    try {
        console.log('SERVICE → getUsersService')
        const users = await User.find().select('-password') //no tiene que devolver el password!
        const usersWithAge = await calculateAge(users)
        console.log("🚀 ~ getUsersService ~ calculateAge:")
        console.log(usersWithAge)
        console.log('---')
        return usersWithAge
    } catch (error) {
        throw error
    }
}

const createUserService = async (data) => {
    try {
        console.log('SERVICE → createUserService')
        console.log(data)
        const existUserEmail = await User.findOne({
            email: data.email
        })

        if (existUserEmail) {
            throw new Error("El usuario ya existe");
        }

        /*         checkUniqueUsername(data.userName) */
        const UserNameExists = await User.findOne({
            userName: data.userName
        })

        if (UserNameExists) {
            throw new Error("El nombre de usuario ya existe");
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
            sexo: data.sexo,
            telefono: data.telefono,
            direccion: data.direccion,
            userName: data.userName,
            pais: data.pais,
            provincia: data.provincia,
            localidad: data.localidad,
            CP: data.CP
        })

        await user.save()

        const savedUser = {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            fechaNacimiento: user.fechaNacimiento,
            sexo: user.sexo,
            telefono: user.telefono,
            direccion: user.direccion,
            userName: user.userName,
            pais: user.pais,
            provincia: user.provincia,
            localidad: user.localidad,
            CP: user.CP
        }

        const [savedUserWithAge] = await calculateAge([savedUser])
        console.log("🚀 ~ createUserService ~ savedUserWithAge:", savedUserWithAge)
        return savedUserWithAge
    } catch (error) {
        throw error
    }
}
/** const updateUserService = async (id, data):
+  * Updates a user's information by their ID.
+  * @param {string} id - The ID of the user to update.
+  * @param {Object} data - The fields to update for the user.
+  * @returns {Promise<Object>} The updated user object with calculated age.
+  * @throws {Error} If the user is not found or if validation fails.
+  */

const updateUserService = async (id, data) => {
    try {
        console.log('SERVICE → updateUserService')
        console.log(`👤 usuario a modificadar: ${id}`)
        console.log(data)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Usuario no encontrado')
        }

        const user = await User.findById(id) // ← Returns null if invalid/not found

        //NO permitir cambiar email
        if (data.email) {
            throw new Error('El email no puede modificarse')
        }
        /*      checkUniqueUsername(data.userName) */
        const UserNameExists = await User.findOne({
            userName: data.userName
        })

        if (UserNameExists) {
            throw new Error("El nombre de usuario ya existe");
        }

        //const allowedFields = 
        // ["nombre", "apellido", "fechaNacimiento", "genero", "telefono", "direccion", "userName", "pais", "provincia", "localidad", "CP"]
        //Update parcial
        if (data.nombre) user.nombre = data.nombre
        if (data.apellido) user.apellido = data.apellido
        if (data.fechaNacimiento) user.fechaNacimiento = data.fechaNacimiento
        if (data.sexo) user.sexo = data.sexo
        if (data.telefono) user.telefono = data.telefono
        if (data.direccion) user.direccion = data.direccion
        if (data.userName) user.userName = data.userName
        if (data.pais) user.pais = data.pais
        if (data.provincia) user.provincia = data.provincia
        if (data.localidad) user.localidad = data.localidad
        if (data.CP) user.CP = data.CP

        //Cambiar password si viene
        if (data.password) {
            user.password = await bcrypt.hash(
                data.password,
                10
            )
        }

        await user.save()

        const updatedUser = {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            fechaNacimiento: user.fechaNacimiento,
            sexo: user.sexo,
            telefono: user.telefono,
            direccion: user.direccion,
            userName: user.userName,
            pais: user.pais,
            provincia: user.provincia,
            localidad: user.localidad,
            CP: user.CP
        }

        const [updatedUserWithAge] = await calculateAge([updatedUser])
        return updatedUserWithAge
    } catch (error) {
        throw error
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