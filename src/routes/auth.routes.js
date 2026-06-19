import express from 'express'

import {  // importamos todos los metodos que creamos en controllers

} from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/auth/login', loginUser)

export default router