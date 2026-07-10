import express from 'express'
import './config/env.js'
import connectDB from './config/db.js'
import corsConfig from './config/cors.js'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express() //levanta el backend como función
app.use(corsConfig);
app.use(express.json()) //para poder usar json desde el body
connectDB() //llamar a la base de datos

//llamar a las rutas
app.use(userRoutes) //ruta de usuarios
app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${process.env.PORT} 🚢`) //process.env.PORT
})



