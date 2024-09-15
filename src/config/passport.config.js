import passport from "passport";
import local from "passport-local";
import UserModel from "../models/user.model.js"
import { createHash, isValidPassword } from "../utils/utils.js";
//import jwt from "passport-jwt";
import GitHubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;

// Estrategia de passport

const initializePassport = () => {
    //Register
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
        //El usuario sera el email que ya tengo registrado
    }, async (req, username, password, done) => {
        //guardo las datos que vienen del body
        const { first_name, last_name, email, age } = req.body;

        try {
            let user = await UserModel.findOne({ email: email });
            if (user) return done(null, false);
            //Si no existe voy a crear uno nuevo:
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
            const user = await UserModel.findOne({ email:email });
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
    ////////////////////////////////////////////////////////////////////////////////77
    //Autenticacion por terceros

    passport.use("github", new GitHubStrategy({
        clienID: "Iv23liAwCzNvdER11HtZ",
        clientSecret: "99dc45883470a03aecccf0f7187ac68700e470bb",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
    }, async (accessToken, refreshToken, profile, done) => {
     
        try {
             //Algo que recomendamos: 
            console.log("Profile: ", profile);
            let user = await UserModel.findOne({ email: profile._json.email });

            if (!user) {
                //Si no lo encontraste registrado previamente, vamos a crearlo!
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 18,
                    email: profile._json.email,
                    password: ""
                }

                //Despues de crear el objeto de usuario, lo creo como documento: 
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                //Si el usuario ya existe, simplemente lo envio para pasar a la vista de profile y tener la session activa. 
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }

    }))

    
}

export default initializePassport;