import { Router } from "express";
import passport from "passport";
import _dirname from "../varios.js";
import { soloAdmin, soloUser } from "../middlewares/auth.js";
import ProductManager from "../controllers/ProductManager.js";

const PM = new ProductManager(_dirname +"/dao/database/products.json");  

const router = Router();

router.get("/", passport.authenticate("jwt", { session: false }), soloUser,async (req, res) => {
    try {
        const listadeproductos = await PM.getProducts();
console.log("listadeproductos", listadeproductos);

        res.render("home", { listadeproductos });
    } catch (error) {
        console.error("Error en cargar los productos:", error);
        res.status(500).send("Error interno");
    }
});

router.get("/login", (req, res) => {
    res.render("login");
})
router.get("/register", (req, res) => {
    res.render("register");
})
router.get("/profile", (req, res)=> {
    res.render("profile");
})
router.get("/realTimeProducts", passport.authenticate("jwt",{session: false}), soloAdmin, (req, res) => {
    res.render("realTimeProducts");
})

export default router;