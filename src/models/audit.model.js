// para guardar los datos de los usuarios eliminados
import { required } from "joi";
import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
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

