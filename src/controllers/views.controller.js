import ProductoService from "../services/producto.service.js";
import CartService from "../services/cart.service.js";

class ViewsController {
    async renderHome(req, res) {
        res.render('home', { title: 'Bienvenido a nuestra tienda Shop Cars' });
    }

    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const products = await ProductoService.getProducts({}, { page, limit });
            res.render('products', { 
                title: 'Nuestros Productos',
                products: products.docs,
                pagination: {
                    page: products.page,
                    totalPages: products.totalPages,
                    hasPrevPage: products.hasPrevPage,
                    hasNextPage: products.hasNextPage,
                    prevLink: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
                    nextLink: products.hasNextPage ? `/products?page=${products.nextPage}` : null
                }
            });
        } catch (error) {
            console.error("Error fetching products:", error); 
            res.status(500).render('error', { message: error.message });
        }
    }

    async renderProductDetail(req, res) {
        try {
            const product = await ProductoService.getProductById(req.params.id);
            res.render('productDetail', { title: product.title, product });
        } catch (error) {
            res.status(404).render('error', { message: error.message });
        }
    }

    async renderCart(req, res) {
        try {
            const cart = await CartService.getCartById(req.params.id);
            res.render('cart', { title: 'Tu Carrito', cart });
        } catch (error) {
            res.status(404).render('error', { message: error.message });
        }
    }
}

export default new ViewsController();
