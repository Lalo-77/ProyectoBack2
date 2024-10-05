import { Router } from "express";
import passport from "passport";
import userController from "../controllers/user.controller.js";
import session from "express-session";

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/current', passport.authenticate("jwt", { session: false }), userController.current);
router.post('/logout', userController.logout);

// SEREALIZAR Y DESEREALIZAR
passport.serializeUser((usuario, done) => {
    done(null, usuario._id);
})
passport.deserializeUser(async (id, done) => {
    try {  
        const usuario = await UsuarioModel.findById(id); 
        done(null, usuario); 
    } catch (error) {  
        done(error);
    }  
})

/*router.get('/login', (req, res) => {  
    console.log('Accediendo a la ruta /login'); // 
    res.render('login'); 
});*/ 

// login/registro a partir de GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.usuario = req.user;
    req.session.login = true;
    res.redirect("/profile");
})



export default router;

