import CartDao from "../dao/cart.dao.js";
import CartDTO from "../dto/cart.dto.js";
import CartModel from "../models/cart.model.js";

class CartRepository {
    
    async createCart() {
        const newCart = new CartModel({ products: [] });
        return await newCart.save();
    } 

    async getCartById(cartId) {
        const cart = await CartDao.getCartById(cartId);
        return new CartDTO(cart)
    }
    async getCartByUserId(userId) {
        return await CartDao.findByUserId(userId);
    }

    async updateCarrito(cartId, updateData) {
        return await CartModel.findByIdAndUpdate(cartId, updateData, { new: true });
    }

    async obtenerCarritos() {
        const carts = await CartDao.obtenerCarritos();
        return carts.map(cart => new CartDTO(cart));
    }

    async actualizarCarrito(cartId, productos) {
        const cart = await CartDao.actualizarCarrito(cartId, productos);
        return new CartDTO(cart);
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        const cart = await this.getCarritoById(cartId);
        const existeProducto = cart.products.find(item => item.productId === productId);

        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        return await this.actualizarCarrito(cartId, cart.products);
    }

    async eliminarProductoDelCarrito(cartId, productId) {
        const cart = await this.getCarritoById(cartId);
        cart.products = cart.products.filter(item => item.productId !== productId);
        return await this.actualizarCarrito(cartId, cart.products);
    }
}

export default new CartRepository();