/* const mongoose = require('mongoose') */
import mongoose from 'mongoose' //importa todo

import { env } from './env.js' //importa solo la funcion dentro de { } 

const connectDB = async () => {
    try {
        console.log('Conectando MongoDB...')
        await mongoose.connect(env.MONGO_URI) //levanta la varialbe de env
        console.log('Mongo conectado')
    } catch (error) {
        console.error('Error conectando MongoDB Mongo:')
        console.log(error)
        /* process.exit(1)    } */
    }
}

module.exports = connectDB