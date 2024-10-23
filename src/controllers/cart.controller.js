class CartController {
    async purchaseCart(req, res) {
        const cartId = req.params.cid;
        try {
            const result = await TicketService.purchaseCart(cartId);
            res.json({
                message: "Compra realizada con éxito",
                ticket: result.ticket,
                productosNoDisponibles: result.productosNoDisponibles
            });
        } catch (error) {
            res.status(500).json({ error: "Error al procesar la compra: " + error.message });
        }
    }

    async crearCarrito(req, res) {
        try {
            const carrito = await CartService.crearCarrito();
            res.status(201).json(carrito);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el carrito' });
        }
    }

    async getCarritoById(req, res) {
        try {
            const carrito = await CartService.getCarritoById(req.params.cartId);
            if (!carrito) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.status(200).json(carrito);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor al obtener el carrito' });
        }
    }

    async agregarProductoAlCarrito(req, res) {
        const { cartId, productId } = req.params;
        const { quantity } = req.body;
        try {
            const carrito = await CartService.agregarProductoAlCarrito(cartId, productId, quantity);
            res.status(200).json(carrito);
        } catch (error) {
            res.status(500).json({ error: 'Error al agregar el producto al carrito' });
        }
    }

    async eliminarProductoDelCarrito(req, res) {
        const { cartId, productId } = req.params;
        try {
            const carrito = await CartService.eliminarProductoDelCarrito(cartId, productId);
            res.status(200).json(carrito);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
        }
    }

    async eliminarTodosLosProductos(req, res) {
        const { cartId } = req.params;
        try {
            const carrito = await CartService.eliminarTodosLosProductos(cartId);
            res.status(200).json(carrito);
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
        }
    }

    async viewCarrito(req, res) {
        try {
            const carrito = await CartService.getCarritoById(req.params.cartId);
            res.render('cart', { 
                products: carrito.products,
                cartId: carrito.id
            });
        } catch (error) {
            res.status(500).render('error', { message: 'Error al cargar el carrito' });
        }
    }
}

export default new CartController();
