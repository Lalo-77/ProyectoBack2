import express from "express";
//import user from "./user/user.js"
import cookieParser from "cookie-parser";
//import session from "express-session";
import { engine } from "express-handlebars"
import sessionRouter from "./routes/session.router.js"
import viewsRouter from "./routes/views.router.js"
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import "./database.js";

const app = express();
const PUERTO = 8080;

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

//Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//RUTAS
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto ${PUERTO}`); 
})