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
import mongoose from "mongoose";
import socketProducts from "./listeners/socketProducts.js";
import Ticket from "./models/tickets.model.js";
import __dirname from "./varios.js";
import { Server } from "socket.io";
import path from "path";
import authRoutes from "./routes/auth.router.js";

const app = express();
const PUERTO = 8080;

app.use(express.static(__dirname + "/public"));

//Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views")); 

//MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "public"));
app.use(cookieParser());

app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://crisn3682:coderhouse@cluster0.xqijc.mongodb.net/Login?retryWrites=true&w=majority&appName=Cluster0",
    }),
}));

mongoose.connect( "mongodb+srv://crisn3682:coderhouse@cluster0.xqijc.mongodb.net/Login?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Conectado a MongoDB");

        const nuevoTicket = new Ticket({
            amount: 100.00,
            purchaser: 'usuario@example.com'
        });
        try {

            const ticketGuardado = await nuevoTicket.save();
            console.log("Ticket guardado:", ticketGuardado);
        } catch (error) {
            console.error("Error al guardar el ticket:", error);
        }

    })
    .catch(err => console.error('No se pudo conectar a MongoDB', err));


app.use(passport.initialize());
app.use(passport.session());
initializePassport();

//RUTAS

app.use("/", viewsRouter);
app.use("/api/session", sessionRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/session", authRoutes);

//Error 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

const httpServer = app.listen(PUERTO, () => {
    try {
        console.log(`Escuchando en el puerto ${PUERTO}`);
    } catch (error) {
        console.log(error);
        
    }
})

const socketServer = new Server(httpServer);

socketProducts(socketServer);