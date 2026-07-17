import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Audit from "../models/audit.model.js"; //models va a llamar a la database, por eso no necesito importarla en este archivo
import mongoose from "mongoose"; //to validate id       /* import { checkUniqueUsername } from "../dto/user.dto.js" */ /* import calcularEdad from "../dao/functions/dao.users.js" */

import calcularEdad from "../functions/edad/edad.users.js";

const getUsersService = async ({ email, id, requesterRole, requesterId }) => {
  console.log("SERVICE → getUsersService");

  try {
    const role = requesterRole?.toUpperCase();
    const currentUserId = requesterId?.toString();

    if (!role) {
      throw {
        statusCode: 403,
        message: "No tienes permisos para ver usuarios",
      };
    }

    if (role === "GUEST") {
      throw {
        statusCode: 403,
        message: "No tienes permisos para ver usuarios",
      };
    }

    // buscar por ID
    if (id) {
      console.log("Buscar por id");
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw {
          statusCode: 400,
          message: "Id inválido",
        };
      }

      if (role === "USER" && id !== currentUserId) {
        throw {
          statusCode: 403,
          message: "No tienes permisos para ver este usuario",
        };
      }

      const user = await User.findById(id).select("-password"); //no tiene que devolver el password!
      /* const users = await User.find().select('-password')*/ //no tiene que devolver el password!
      if (!user) {
        throw {
          statusCode: 404,
          message: "Usuario no encontrado",
        };
      }

      if (role === "ADMIN" && user.role === "ROOT") {
        throw {
          statusCode: 403,
          message: "No tienes permisos para ver usuarios root",
        };
      }

      console.log("🚀 ~ getUsersService ~ calcularEdad:");
      calcularEdad(user);
      console.log("🚀 ~ getUsersService ~ user:", user);

      return user;
    }

    //Buscar por email
    if (email) {
      const user = await User.findOne({ email }).select("-password");

      if (!user) {
        throw {
          statusCode: 404,
          message: "Usuario no encontrado",
        };
      }

      if (role === "USER" && user._id.toString() !== currentUserId) {
        throw {
          statusCode: 403,
          message: "No tienes permisos para ver este usuario",
        };
      }

      if (role === "ADMIN" && user.role === "ROOT") {
        throw {
          statusCode: 403,
          message: "No tienes permisos para ver usuarios root",
        };
      }

      console.log("🚀 ~ getUsersService ~ calcularEdad:");
      calcularEdad(user);
      console.log("🚀 ~ getUsersService ~ user:", user);

      return user;
    }

    //Obtener todos los usuarios
    /* return await User.find().select("-password").sort({ nombre: 1 }); */
    if (role === "ADMIN") {
      const allUsers = await User.find({ role: { $ne: "ROOT" } })
        .select("-password")
        .sort({ nombre: 1 });
      console.log("🚀 ~ getUsersService ~ calcularEdad: 👤👤👤 allUsers");
      return calcularEdad(allUsers);
      /* console.log("🚀 ~ getUsersService ~ user:", user); */
      /* return await User.find({ role: { $ne: "ROOT" } }).select("-password").sort({ nombre: 1 }); */
    }
    const thisUser = await User.find().select("-password").sort({ nombre: 1 });
    console.log("🚀 ~ getUsersService ~ calcularEdad: 👤 thisUsers");
    return calcularEdad(thisUser);
    /* return await User.find().select("-password").sort({ nombre: 1 }); */
  } catch (error) {
    console.error("❌ Error en getUsersService:", error);
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error interno del servidor",
      errors: error.errors || null,
    };
  }
  /* console.log("🚀 ~ getUsersService ~ calcularEdad:")
console.log(usersWithAge) */
  console.log("---");
  /* return usersWithAge */
};

const createUserService = async (data) => {
  console.log("SERVICE → createUserService");

  try {
    const existUser = await User.findOne({
      email: data.email,
    });

    if (existUser) {
      throw {
        statusCode: 400,
        message: "El usuario ya existe",
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    //calcular edad:

    const user = new User({
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      password: hashedPassword,
      fechaNacimiento: data.fechaNacimiento,
      edad: data.edad,
      genero: data.genero,
      telefono: data.telefono,
      direccion: data.direccion,
      localidad: data.localidad,
      provincia: data.provincia,
      pais: data.pais,
      codigoPostal: data.codigoPostal,
      userName: data.userName,
    });

    await user.save();

    return {
      id: user._id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      fechaNacimiento: user.fechaNacimiento,
      edad: user.edad,
      genero: user.genero,
      telefono: user.telefono,
      direccion: user.direccion,
      localidad: user.localidad,
      provincia: user.provincia,
      pais: user.pais,
      codigoPostal: user.codigoPostal,
      userName: user.userName,
    }; // desgloso el objeto para asegurarme de que no se envía la contraseña
  } catch (error) {
    console.error("❌ Error en createUserService", error);
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error interno del servidor",
      errors: error.errors || null,
    };
  }
};

const updateUserService = async (id, data) => {
  //Updates a user's information by their ID. @param {Object} data - The fields to update for the user.
  console.log("SERVICE → updateUserService");
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw {
        statusCode: 400,
        message: "Id inválido",
      };
    } //@throws {Error} If the user is not found or if validation fails.

    const user = await User.findById(id); // ← Returns null if invalid/not found

    if (!user) {
      throw {
        statusCode: 400,
        message: "Usuario no encontrado",
      };
    }

    //El eamil existe pero no es modificable
    if (data.email !== undefined) {
      throw {
        statusCode: 400,
        message: "El email no puede modificarse",
      };
    }
    // Si otro usuario ya tiene ese userName, informar que el nombre de usuario ya existe:
    /* if () {
            throw {
                statusCode: 400,
                message: "El nombre de usuario ya existe"
            };
        } */

    //calcular edad

    const allowedFields = [
      "nombre",
      "apellido",
      "fechaNacimiento",
      "edad",
      "genero",
      "telefono",
      "direccion",
      "localidad",
      "provincia",
      "pais",
      "codigoPostal",
      /* "role", */
      "userName",
    ];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        user[field] = data[field];
      }
    });

    //Cambiar password si viene informada
    if (data.password !== undefined) {
      user.password = await bcrypt.hash(data.password, 10);
    }

    await user.save();

    return {
      id: user._id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      fechaNacimiento: user.fechaNacimiento,
      edad: user.edad,
      genero: user.genero,
      telefono: user.telefono,
      direccion: user.direccion,
      localidad: user.localidad,
      provincia: user.provincia,
      pais: user.pais,
      codigoPostal: user.codigoPostal,
      role: user.role,
      userName: user.userName,
    };
    /* const [updatedUserWithAge] = await calcularEdad([user])
        return updatedUserWithAge */ // @returns {Promise<Object>} The updated user object with calculated age.
  } catch (error) {
    console.error("❌ Error en updateUserService:", error);

    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error interno del servidor",
      errors: error.errors || null,
    };
  }
};

const deleteUserService = async (id) => {
  console.log("SERVICE → deleteUserService");

  let session;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw {
        statusCode: 400,
        message: "Id inválido",
      };
    }

    session = await mongoose.startSession();

    await session.withTransaction(async () => {
      const user = await User.findById(id).session(session);

      if (!user) {
        throw {
          statusCode: 404,
          message: "Usuario no encontrado",
        };
      }

      await Audit.create(
        [
          {
            usuarioEliminado: user.toObject(),
            fechaEliminacion: new Date(),
          },
        ],
        { session },
      );

      await user.deleteOne({ session }); //Eliminar usuario y cerrar session
    });

    return {
      message: "Usuario eliminado",
    };
  } catch (error) {
    console.error("❌ Error en deleteUserService", error);
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || "Error interno del servidor",
      errors: error.errors || null,
    };
  } finally {
    //si ni el try ni el catch la cierran, que se cierre la session
    if (session) {
      await session.endSession();
    }
  }
};

export { getUsersService, createUserService, updateUserService, deleteUserService };
