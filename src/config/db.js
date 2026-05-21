import mongoose from 'mongoose' //importa todo

import { env } from './env.js' //importa solo la funcion dentro de { } 
const connectDB = async () => {
    try {
        console.log('🔄 Conectando MongoDB...')
        await mongoose.connect(env.MONGO_URI) //levanta la variable desde env
        console.log('✔ Mongo conectado')
    } catch (error) {
        console.error('❌ Error conectando MongoDB:')
        console.log(error)
    }
}

export default connectDB

