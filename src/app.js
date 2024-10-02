import express from "express";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import session from "express-session";
import { engine } from "express-handlebars";
import sessionRouter from "./routes/session.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import cartsRouter from "./routes/carts.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import "./database.js";
//import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = express();
const PUERTO = 8080;

//Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://crisn3682:coderhouse@cluster0.xqijc.mongodb.net/Login?retryWrites=true&w=majority&appName=Cluster0",
    }),
}));
app.use(cookieParser());
app.use(express.static("./src/public"));

// cambios con passport:
app.use(passport.initialize());
initializePassport();
app.use(passport.session());

//RUTAS

app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);
app.use("/api/products", productsRouter);
app.use("/carts", cartsRouter);

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto ${PUERTO}`); 
})