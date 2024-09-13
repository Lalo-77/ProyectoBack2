import passport from "passport";
import local from "passport-local";
import UserModel from "../models/user.model.js"
import { createHash, isValidPassword } from "../utils/utils.js";
//import jwt from "passport-jwt";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    //Register
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, user, password, done) => {
        const { first_name, last_name,email, age } = req.body;

        try {
            let user = await UserModel.findOne({ email: email });
            if (user) return done(null, false);
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            let result = await UserModel.create(newUser);
            return done(null, result);

        } catch (error) {
            return done(error);
        }
    }))

    // Login
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email: email });
            if (!user) {
                console.log("Este usuario no existe!!!");
                return done(null, false);
            }
            //Si existe el user, verifico la contraseña
            if (!isValidPassword(password, user)) return done(null, false);
            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }))

    // Serealizar y deserealizar

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    })
}
export default initializePassport;