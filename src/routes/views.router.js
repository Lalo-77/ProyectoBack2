import { Router } from "express";
import passport from "passport";

const router = Router();

//Ruta para el fomulario de Login:

router.get("/login", (req, res) => {
    if (req.session.login) {
        return res.redirect("/profile");
    }
    res.render("login", {user: req.session.user});
})

// Ruta para el formulario de Register:

router.get("/register", (req, res) => {
    if(req.session.login) {
        return res.redirect("/profile");
    }
    res.render("register");
})
// Ruta para el formulario de Perfil:

router.get("/profile", (req, res) => {
    if (!req.session.login) {
        return res.redirect("/login"); 
    }
    res.render("profile", {user: req.session.user});
});

// Enviamos al usuario a la vista de productos:
router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 2 } = req.query;
        const productos = await productManager.getProducts({
            page: parseInt(page),
            limit: parseInt(limit)
        });
        const nuevoArray = productos.docs.map(producto => {
            const { _id, ...rest } = producto.toObject();
            return { _id: _id.toString(), ...rest };
        });

        res.render("products", {
            user: req.user, // Se agrega el usuario autenticado a la vista
            productos: nuevoArray
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});

export default router;