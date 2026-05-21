// esta es la última capa?
import bcrypt from "bcryptjs"
import User from '../models/user.model.js'
import Audit from '../models/audit.model.js'
//models va a llamar a la database, por eso no necesito importarla en este archivo

const getUsersService = async () => {
    try {
        console.log('SERVICE → getUsersService')
        const users = await User.find().select('-password') //no tiene que devolver el password!
        console.log('---')
        return users
    } catch (error) {
        throw error
    }
}

const createUserService = async (data) => {
    try {
        console.log('SERVICE → createUserService')
        console.log(data)
        const existUser = await User.findOne({
            email: data.email
        })

        if (existUser) {
            throw new Error("El usuario ya existe");
        }

        const hashedPassword = await bcrypt.hash(
            data.password,
            10
        )

        const user = new user ({
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            password: hashedPassword,
            edad: data.edad,
            sexo: data.sexo,
            telefono: data.telefono,
            direccion: data.direccion
        })





        console.log('---')
        return data
    } catch (error) {
        throw error
    }
}

const updateUserService = async (id, data) => {
    try {
        console.log('SERVICE → updateUserService')
        console.log(id)
        console.log(data)
        console.log('---')
        return {
            id,
            ...data //... desenconstractura y retorna TODO el objeto
        }
    } catch (error) {
        throw error
    }
}

const deleteUserService = async (id) => {
    try {
        console.log('SERVICE → deleteUserService')
        console.log(id)
        console.log('---')
        return {
            message: "Usuario eliminado"
        }
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