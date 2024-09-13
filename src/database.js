import mongoose from "mongoose";

mongoose.connect("mongodb+srv://crisn3682:coderhouse@cluster0.xqijc.mongodb.net/Login?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("Conexion exitosa!"))
.catch((error) => console.log(error))