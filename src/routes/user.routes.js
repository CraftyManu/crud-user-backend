import express from 'express'

import {  // importamos todos los metodos que creamos en controllers
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/user.controller.js'

import { authMiddleware } from '../middlewares/auth.middleware.js'
import { authorizeRoles } from '../middlewares/role.middleware.js'

const router = express.Router()

//exponemos las rutas y las ejecutamos

/* router.get('/users', getUsers) */
router.get('/users',authMiddleware, authorizeRoles('ROOT', 'ADMIN') , getUsers)

/* router.post('/users', createUser) */
router.post('/users', authMiddleware, authorizeRoles('ROOT', 'ADMIN'),createUser)

router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

export default router