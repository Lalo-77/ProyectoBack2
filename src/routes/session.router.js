import { Router } from "express";
import passport from "passport";
import userController from "../controllers/user.controller.js";
import UsuarioModel from "../models/usuarios.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, usuario, password } = req.body;

    try {
        const existeUsuario = await UsuarioModel.findOne({ usuario });

        if (existeUsuario) {
            return res.status(400).json({ error: "El usuario ya existe" });
        }
        const nuevoUsuario = new UsuarioModel({
            first_name,
            last_name,
            email,
            age,
            usuario,
            password: createHash(password)
        });
        await nuevoUsuario.save();

        const token = jwt.sign(
            { usuario: nuevoUsuario.usuario, rol: nuevoUsuario.rol },
            "coderhouse",
            { expiresIn: "1h" }
        );
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000,
            httpOnly: true
        });

        return res.redirect("/api/session/current");
    } catch (error) {
        console.error("Error during registration:", error);
        console.log(req.body);
        return res.status(500).json({ error: "Error interno del servidor" });

    }
});

// VERSION DE REGISTER CON PASSPORT

/*router.post("/register", passport.authenticate("register", {
    failureRedirect: "/failedregister"}), async (req, res) => {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }
        req.session.login = true;
        res.redirect("/profile");
    });
    router.get("/failureRegister", (req, res) => {
        res.send("Registro fallido");
    })*/

// VERSION DEL LOGIN CON PASSPORT

router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/session/faillogin"
}), async (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }

    req.session.login = true;

    res.redirect("/profile");
})
router.get("/faillogin", async (req, res) => {
    res.send("Fallo el login");
})
// SEREALIZAR Y DESEREALIZAR
passport.serializeUser((user, done) => {
    done(null, user._id);
})
passport.deserializeUser(async (id, done) => {
    let user = await UsuarioModel.findById({ _id: id });
    done(null, user);
})
// Logout 

router.get("/logout", userController.logout);


// login/registro a partir de GitHub

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
})

// Ruta current
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
        // Renderizamos una vista especial "home" con la info del usuario:
        res.render("home", { usuario: req.user.usuario });
    } else {
        //Si no hay usuario asociado pongamos un error:
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

router.get("/session", (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.session("Te damos la Bienvenida a nuestro sitio Web");
    } else {
        req.session.counter = 1;
        req.send("Te damos la Bienida a nuestro sitio Web");
    }
});

export default router;

