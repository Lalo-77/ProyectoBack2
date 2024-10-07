import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
    ]
});

CartSchema.pre("findOne", function (next) {
    this.populate("products.product", "_id title price");
    next();
});

const CartModel = mongoose.model("carts", CartSchema);

export default CartModel;