import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ //new xq es un usuario nuevo
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fechaNacimiento: {
        type: Date,
        required: true,
    },
    sexo: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    pais: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: true
    },
    localidad: {
        type: String,
        required: true
    },
    CP: {
        type: Number,
        required: true
    },
    edad: {
        type: Number
    }


}, {
    timestamps: true //hora utc0 (-3 para nuestro uso horario)
})

const User = mongoose.model('User', userSchema)

export default User