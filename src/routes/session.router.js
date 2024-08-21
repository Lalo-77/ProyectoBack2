import { Router } from  "express";
import UsuarioModel from "../models/usuarios.models.js";
import { createHash, isValidPassword  } from "../util/util.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req, res) => {
    const {usuario, password} = req.body;

    try {
        const existeUsuario = await UsuarioModel.findOne({usuario});
        if(existeUsuario) {
            return res.status(400).send("El usuario ya existe");
        }

        const nuevoUsuario = new UsuarioModel({
            usuario,
            password: createHash(password)
        })
        await nuevoUsuario.save();

        const token = jwt.sign({usuario: nuevoUsuario.usuario, rol: nuevoUsuario.rol}, "coderhouse", {expireIn:"1h"})

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true
        })

        res.redirect("/api/sessions/home");

    } catch (error) {
         res.status(500).send("Error interno, no pudimos encontrar el usuario")
    }
})

router.post("/login", async (req, res) => {
    const {usuario, password} = req.body
    try {
        const usuarioEncontrado = await UsuarioModel.findOne({usuario});
        if(!usuarioEncontrado) {
            return res.status(401).send("Usuario no valido");

        }
        if(isValidPassword(password, usuarioEncontrado)) {
             return res.status(401).send("Password no valida");
        }

        const token = jwt.sign({usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol}, "coderhouse", {expireIn:"1h"})

        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true
        })
        res.redirect("/api/sessions/home");
        
    } catch (error) {
        res.status(500).send("Error interno, no pudimos encontrar el usuario")
    }
})
// Ruta current
router.get("/current", passport.authenticate("jwt",{session: false}), (req, res) => {
    if(req.user) {
        res.render("home", {usuario: req.user.usuario});
    } else {
        res.status(401).send("No autorizado");
    }
})
// Logout
router.post("/logout", (req, res) => {

    res.clearCookie("coderCookieToken");
    res.redirect("/login");
})
// Ruta par admins
router.get("/admin", passport.authenticate("jwt",{session:false}), (req, res) => {
    if(req.user.rol != "admin") {
        return res.status(403).send("Acceso denegado! ");
    }
    res.render("admin");
})



export default router;