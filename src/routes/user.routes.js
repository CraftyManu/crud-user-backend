import express from 'express'

import {  // importamos todos los metodos que creamos en controllers
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/user.controller.js'

const router = express.Router()

//exponemos las rutas y las ejecutamos

router.get('/users', getUsers)
router.post('/users', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

export default router