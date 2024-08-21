import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
    usuario: String,
    first_name: String,
    last_name:String,
    email:String,
    age:Number,
    password: String,
    //cartId: crearCarrito(),
    rol: {
        type: String,
        enum: ["admin", "user"], 
        default: "user"
    }
})

const UsuarioModel = mongoose.model("usuarios", usuarioSchema);

export default UsuarioModel;