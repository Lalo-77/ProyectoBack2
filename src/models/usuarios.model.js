import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    usuario: {
        type: String,
    },
    first_name: { 
        type: String, 
        required: true
    },
    last_name: { 
        type: String, 
        required: true
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        index: true
    },
    password: { 
        type: String, 
        required: true
    },
    age: { 
        type: Number, 
        required: true
    },
    rol: { 
        type: String,
        enum: ["admin","user"],
        default: "user"
    }
})

const usuarioModel = mongoose.model("usuarios", usuarioSchema);

export default usuarioModel;