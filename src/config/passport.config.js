import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import UserModel from "../models/usuarios.model.js"
import { createHash, isValidPassword } from "../utils/utils.js";
import GitHubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;
// Estrategia de passport
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
}
const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse"

    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error)
        }
    }))
    // Register
 
    // Login
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const usuario = await UsuariosModel.findOne({ email: email });
            if (!usuario) {
                console.log("Este usuario no existe!!!");
                return done(null, false);
            }
            //Si existe el user, verifico la contraseña
            if (!isValidPassword(password, usuario)) return done(null, false);
            return done(null, usuario);
        } catch (error) {
            return done(error);
        }
    }))

    // Serealizar y deserealizar

    passport.serializeUser((usuario, done) => {
        done(null, usuario._id)
    })

    passport.deserializeUser(async (id, done) => {
        let usuario = await UserModel.findById({ _id: id });
        done(null, usuario);
    })
    ////////////////////////////////////////////////////////////////////////////////77
    //Autenticacion por terceros

    passport.use("github", new GitHubStrategy({
        clienID: "Iv23liAwCzNvdER11HtZ",
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

}

export default initializePassport;