import { Router } from "express";
import UserModel from "../models/user.model.js";
import {createHash, isValidPassword } from "../utils/utils.js"
import passport from "passport";

const router = Router(); 

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    try {

        const existeUser = await UserModel.findOne({email: email});

        if(existeUser) {
            return res.status(400).send("El correo electronico ya esta registrado");
        }
        const nuevoUser = await UserModel.create({
            first_name,
            last_name, 
            email, 
            password: createHash(password),
            age
        });

        req.session.user = {...nuevoUser._doc};
        req.session.login = true;

        res.status(200).send("Usuario creado con exito");

        // Generar el token de JWT:
  const token = jwt.sign({usuario: nuevoUsuario.usuario, rol: nuevoUsuario.rol},
    "coderhouse", { expiresIn: "1h"});
    
        // Generamos la cookie:
        res.cookie("coderCookieToken", token, {
        maxAge: 3600000, //1 hora de vida
        httpOnly: true // recuerdo que esto es para que solo sea accesible mediante peticiones http.
    })
    } catch (error) {
        res.status(500).send("Error interno");
    }
})

// Login :
router.post("/login", async (req, res) => {
    const {email, password} = req.body; // viene del body
    
    try {
        const usuario = await UserModel.findOne({email: email});

        if(usuario) {
            if (isValidPassword ( password, usuario )) {
                req.session.user = {
                    email: usuario.email,
                    age: usuario.age,
                    first_name: usuario.first_name,
                    last_name: usuario.last_name,
                } 
                req.session.login = true;
                res.redirect("/profile");
            } else {
                res.status(401).send("Password incorrecto");
            }
        } else {
            res.status(404).send("Usuario no encontrado");
        }
    } catch (error) {
        res.status(500).send("Error interno por un ruso infiltrado");
    }
})
// Logout 

router.get("/logout", (req, res) => {
    if (req.session.login){
        req.session.destroy();
    }
    res.redirect("/login");
})

// Ruta current
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
        // Renderizamos una vista especial "home" con la info del usuario:
        res.render("home", { usuario: req.user.usuario });
    } else {
        //Si no hay usuario asociado tiremos un error:
        res.status(401).send("No autorizado");
    }
})
router.get("/productos", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
        res.render("home", { user: req.user.user });
    } else {
        res.status(401).send("No esta autenticado, Token Invalido");
    }
});

// Ruta para admins
router.get("/admin", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user.rol != "admin") {
        return res.status(403).send("Acceso denegado! ");
    }
    res.render("admin");
})

router.get("/session", (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        req.session("Te damos la Bienvenida a nuestro sitio Web");
    } else {
        req.session.counter = 1;
        req.send("Te damos la Bienida a nuestro sitio Web");
    }
});

export default router;

