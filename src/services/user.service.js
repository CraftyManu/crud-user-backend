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

        const user = new User({
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            password: hashedPassword,
            edad: data.edad,
            sexo: data.sexo,
            telefono: data.telefono,
            direccion: data.direccion
        })

        await user.save()
        return {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            edad: user.edad,
            sexo: user.sexo,
            telefono: user.telefono,
            direccion: user.direccion
        }
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
        const user = await User.findById(id)

        if (!user) {
            throw new Error('Usuario no encontrado')
        }

        //NO permitir cambiar email
        if (data.email) {
            throw new Error('El email no puede modificarse')
        }
        //Update parcial
        if (data.nombre) user.nombre = data.nombre
        if (data.apellido) user.apellido = data.apellido
        if (data.edad) user.edad = data.edad
        if (data.sexo) user.sexo = data.sexo
        if (data.telefono) user.telefono = data.telefono
        if (data.direccion) user.direccion = data.direccion

        //Cambiar password si viene
        if (data.password) {
            user.password = await bcrypt.hash(
                data.password,
                10
            )
        }

        await user.save()

        return {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            edad: user.edad,
            sexo: user.sexo,
            telefono: user.telefono,
            direccion: user.direccion
        }
        console.log('---')
    } catch (error) {
        throw error
    }
}

const deleteUserService = async (id) => {
    try {
        console.log('SERVICE → deleteUserService')
        console.log(id)
        const user = await User.findById(id)
        if (!user) {
            throw new Error('Usuario no encontrado')
        }

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