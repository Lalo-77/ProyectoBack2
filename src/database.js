import mongoose from "mongoose";

mongoose.connect("mongodb+srv://crisn3682:chicho1234@cluster0.yukdp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("Nos conectamos a mongodb"))
.catch((error) => console.log(error))