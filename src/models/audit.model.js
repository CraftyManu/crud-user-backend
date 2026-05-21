// para guardar los datos de los usuarios eliminados
import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({  //la primera vez que se usa mongoDB crea la base de datos 'audit'?
    usuarioEliminado: {
        type: Object,
        required: true
    },
    fechaEliminacion: {
        type: Date,
        default: Date.now //hora del servidor
    }
})

const Audit = mongoose.model('Audit', auditSchema)

export default Audit

