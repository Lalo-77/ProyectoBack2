import CartRepository from "../repositories/cart.repository.js";

class CartService {
    async crearCarrito() {
        try {
            return await CartRepository.crearCarrito();
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw new Error('No se pudo crear el carrito');
        }
    }

    async getCarritoById(cartId) {
        if (!cartId) {
            throw new Error('El ID del carrito es requerido');
        }
        try {
            const carrito = await CartRepository.getCarritoById(cartId);
            if (!carrito) {
                throw new Error('Carrito no encontrado');
            }
            return carrito;
        } catch (error) {
            console.error(`Error al obtener el carrito ${cartId}:`, error);
            throw error;
        }
    }

    async obtenerCarritos() {
        try {
            return await CartRepository.obtenerCarritos();
        } catch (error) {
            console.error('Error al obtener los carritos:', error);
            throw new Error('No se pudieron obtener los carritos');
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity) {
        if (!cartId || !productId) {
            throw new Error('El ID del carrito y el ID del producto son requeridos');
        }
        if (quantity <= 0) {
            throw new Error('La cantidad debe ser mayor que cero');
        }
        try {
            return await CartRepository.agregarProductoAlCarrito(cartId, productId, quantity);
        } catch (error) {
            console.error(`Error al agregar producto ${productId} al carrito ${cartId}:`, error);
            throw new Error('No se pudo agregar el producto al carrito');
        }
    }

    async eliminarProductoDelCarrito(cartId, productId) {
        if (!cartId || !productId) {
            throw new Error('El ID del carrito y el ID del producto son requeridos');
        }
        try {
            return await CartRepository.eliminarProductoDelCarrito(cartId, productId);
        } catch (error) {
            console.error(`Error al eliminar producto ${productId} del carrito ${cartId}:`, error);
            throw new Error('No se pudo eliminar el producto del carrito');
        }
    }

    async eliminarTodosLosProductos(cartId) {
        if (!cartId) {
            throw new Error('El ID del carrito es requerido');
        }
        try {
            return await CartRepository.eliminarTodosLosProductos(cartId);
        } catch (error) {
            console.error(`Error al eliminar todos los productos del carrito ${cartId}:`, error);
            throw new Error('No se pudieron eliminar todos los productos del carrito');
        }
    }
}

export default new CartService();
