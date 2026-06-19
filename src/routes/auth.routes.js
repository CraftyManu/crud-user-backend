import express from 'express'

import { login } from '../controllers/auth.controller.js' // importamos todos los metodos que creamos en controllers

const router = express.Router()

router.post('/login', login,)

export default router;