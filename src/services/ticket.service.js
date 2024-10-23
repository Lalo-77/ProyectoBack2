import TicketRepository from "../repositories/ticket.respository.js";
import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import UserRepository from "../repositories/user.repository.js";
import { calcularTotal } from "../utils/utils.js";

class TicketService {
    async purchaseCart(cartId) {
        const cart = await CartRepository.getCartById(cartId);
        const productosNoDisponibles = [];
        

        for (const item of cart.products) {
            const product = await ProductRepository.getProductById(item.product);
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await ProductRepository.updateProduct(product._id, { stock: product.stock });
                calcularTotal;
            } else {
                productosNoDisponibles.push(item.product);
            }
        }

        const user = await UserRepository.getUserById(cartId);

        const ticketData = {
            amount: calcularTotal,
            purchaser: user.email
        };

        const ticket = await TicketRepository.createTicket(ticketData);

        // Eliminar productos no disponibles del carrito
        cart.products = cart.products.filter(item => !productosNoDisponibles.includes(item.product));
        await CartRepository.updateCarrito(cart._id, cart);

        return { ticket, productosNoDisponibles };
    }
}

export default new TicketService();
