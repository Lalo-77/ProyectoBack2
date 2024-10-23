import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const router = Router();

// Registro
router.post("/register", (req, res, next) => {
    passport.authenticate("register", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(400).json({ message: info.message || "Error al registrar el usuario." });
        }
        req.login(user, (err) => {
            if (err) return next(err);
            return res.status(200).json({ message: "Registro exitoso", user });
        });
    })(req, res, next);
});

// Login
router.post("/login", (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(400).json({ message: "Usuario o contraseña incorrecta." });
        }
        req.login(user, (err) => {
            if (err) return next(err);
          
            if (!user._id) {
                return res.status(500).json({ message: "Error interno: el usuario no tiene un ID válido." });
            }
            const token = jwt.sign({ id: user._id, email: user.email }, config.jwtSecret, { expiresIn: "1h" });
            res.cookie("coderCookieToken", token, { maxAge: 3600000, httpOnly: true });
            return res.status(200).json({ message: "Login exitoso", token });
        });
    })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
});

export default router;
