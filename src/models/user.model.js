import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    //new xq es un usuario nuevo
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fechaNacimiento: {
      type: Date,
      required: true,
    },
    edad: {
      type: Number,
      /* required: true */ //not required -> la calculo en base a fecha de nacimiento
    },
    genero: {
      type: String,
      required: true,
      enum: ["Femenino", "Masculino", "Otro"],
      default: "Otro",
    },
    telefono: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      required: true,
    },
    localidad: {
      type: String,
      required: true,
    },
    provincia: {
      type: String,
      required: true,
    },
    pais: {
      type: String,
      required: true,
    },
    codigoPostal: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ROOT", "ADMIN", "USER", "GUEST"],
      default: "USER",
    },
    userName: {
      type: String,
    },
    ultimoLogin: {
      type: Date,
      default: null,
    },
    avatarURL: {
      type: String,
    },
  },
  {
    timestamps: true, //hora utc0 (-3 para nuestro uso horario)
  },
);

const User = mongoose.model("User", userSchema);

export default User;
