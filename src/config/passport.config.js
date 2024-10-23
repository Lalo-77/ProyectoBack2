import passport from "passport";
import  { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import UserService from "../services/user.service.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import config from "./config.js";
import GitHubStrategy from "passport-github2";
import session from "express-session";

// Estrategia de registro

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField:"email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, role } = req.body;

        try {
            let user = await UserService.getUserByEmail(email);
            if (user) return done(null, false, { message: "El usuario ya existe "});

            const newUser = await UserService.registerUser({
                first_name,
                last_name,
                email,
                password,
                age,
                role
            });
            return done(null, newUser);
        } catch (error) {
            return done(error)
        }
    }))
 
    // Estrategia de Login
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserService.loginUser( email, password);
            if (!user) return done(null, false, { message: "Usuario o contraseña incorrecta "})

                return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

//Autenticacion por terceros
    
passport.use("github", new GitHubStrategy({
    clientID: "Iv23liAwCzNvdER11HtZ",
    clientSecret: "99dc45883470a03aecccf0f7187ac68700e470bb",
    callbackURL: "http://localhost:8080/api/session/githubcallback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let usuario = await UserModel.findOne({ githubId: profile.id });
        if (!usuario) {
            usuario = await UserModel.create({
                githubId: profile.id,
                email: profile._json.email,
            });
        }
        return done(null, usuario);
    } catch (error) {
        return done(error);
    }

}));

       // Serealizar y deserealizar
       passport.serializeUser((user, done) => {
        done(null, user._id.toString());
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserService.getUserById(id);
            if (!user) {
                return done(null, false);
            }
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
export default initializePassport;
