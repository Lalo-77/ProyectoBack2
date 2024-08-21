import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: String,
    description: String,
    completed: {
        type: Boolean,
        default: false
    }
})

const ProductModel = mongoose.model("product", schema)

export default ProductModel;