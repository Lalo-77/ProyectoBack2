import express from 'express';
import CartController from '../controllers/cart.controller.js';
import ViewsController from '../controllers/views.controller.js';
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import ProductoController from '../controllers/producto.controller.js';
import { Admin, User } from '../middlewares/auth.js';
import  ProductManager from "../controllers/ProductsManager.js";
import _dirname  from "../varios.js";

const router = express.Router();

const PM = new ProductManager(_dirname +"/database/products.json");

const ProductService = new ProductoController(PM);

router.get('/', ViewsController.renderHome);
router.get('/products', ViewsController.renderProducts);
router.get('/product/:id', ViewsController.renderProductDetail);
router.get('/carts/:id', ViewsController.renderCart);

router.get('/carrito/:cartId', CartController.viewCarrito);

const authenticateJWT = (req, res, next) => {
    const token = req.cookies["coderCookieToken"];
    if (!token) return res.redirect("/login");

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) return res.redirect("/login");
        req.user = user;
        next();
    });
};

router.get("/realtimeproducts", Admin,  (req, res) => {
    res.render("realtimeproducts");
});

router.get("/home", authenticateJWT, async (req, res) => {
    const { page = 1, limit = 10, sort = 'asc' } = req.query;
    try {
        const productos = await ProductService.getProducts({ page, limit, sort });
        if (!productos.docs || productos.docs.length === 0) {
            return res.render("home", { productos: [], message: "No se encontraron productos", user: req.user });
        }
        res.render("home", { productos: productos.docs, ...productos, user: req.user });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get("/carts/:cid", authenticateJWT, async (req, res) => {
    try {
        const carrito = await CartService.getCarritoById(req.params.cid);
        res.render("carts", { productos: carrito.products, user: req.user });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});

router.get("/login", (req, res) => {
    /*const token = req.cookies["coderCookieToken"];
    if (token) return res.redirect("/products");*/
    res.render("login");
});

router.get("/register", (req, res) => {
    /*const token = req.cookies["coderCookieToken"];
    if (token) return res.redirect("/products");*/
    res.render("register");
});

router.get("/profile", authenticateJWT, (req, res) => {
    res.render("profile", { user: req.user });
});

router.get("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
});

export default router;