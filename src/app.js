import express from "express";
//import user from "./user/user.js"
import cookieParser from "cookie-parser";
import session from "express-session";
import { engine } from "express-handlebars";
import sessionRouter from "./routes/sessions.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import cartsRouter from "./routes/carts.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import "./database.js";
import jwt from "jsonwebtoken";

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
app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://crisn3682:chicho1234@cluster0.nchd5.mongodb.net/PRODUCTOS-BACKEND?retryWrites=true&w=majority&appName=Cluster0",
    })
}))

app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto ${PUERTO}`); 
})