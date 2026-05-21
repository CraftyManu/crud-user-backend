// esta es la última capa?
import bcrypt from "bcryptjs"
import User from '../models/user.model.js'
import Audit from '../models/audit.model.js'
//models va a llamar a la database, por eso no necesito importarla en este archivo

const getUsersService = async () => {
    try {
        console.log('SERVICE → getUsersService')
        console.log('---')
        return [] 
    } catch (error) {
        throw error
    }
}

const createUserService = async (data) => {
    try {
        console.log('SERVICE → createUserService')
        console.log(data)
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