import { Router } from "express";
import UserModel from "../models/user.model.js";
import {createHash, isValidPassword } from "../utils/utils.js"
import passport from "passport";

const router = Router(); 

// VERSION DE REGISTER CON PASSPORT

router.post("/register", passport.authenticate("register", {
    failureRedirect: "/failedregister"}), async (req, res) => {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.userage,
            email: req.user.email
        }
        req.session.login = true;
        res.redirect("/profile");
    });
    router.get("/failureRegister", (req, res) => {
        res.send("Registro fallido");
    })

// VERSION DEL LOGIN CON PASSPORT

router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/session/faillogin"
}), async (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.userage,
        email: req.user.email
    }

    req.session.login = true;

    res.redirect("/profile");
})
router.get("/faillogin", async (req, res) => {
    req.send("Fallo el login");
})
// SEREALIZAR Y DESEREALIZAR
passport.serializeUser((user, done) => {
    done(null, user._id);
})
passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({_id:id});
    done(null, user);
})
// Logout 

router.get("/logout", (req, res) => {
    if (req.session.login){
        req.session.destroy();
    }
    res.redirect("/login");
})

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

