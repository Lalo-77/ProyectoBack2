import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema({
    _id: { type: String },
    title:{ type:  String, require: true },
    description: { type: String, require: true },
    code: { type: String, require: true },
    price: { type: String, require: true },
    status: { type: String, require: true },
    stock: { type: String, require: true },
    category: { type: String, require: true },
    image: { type: String, default: '' }
})

schema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("products", schema)

export default ProductModel;