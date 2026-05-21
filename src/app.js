import express from 'express'
import './config/env.js'
import connectDB from './config/db.js'
import userRoutes from './routes/user.routes.js'

const app = express() //levanta el backend como función
app.use(express.json()) //para poder usar json desde el body

connectDB() //llamar a la base de datos

//llamar a las rutas
app.use(userRoutes) //ruta de usuarios

app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT} 🚢`)
})



