import ProductManager from "../controllers/ProductsManager.js";
import __dirname from "../varios.js";
import { Server } from "socket.io";
import http from "http";

const PM = new ProductManager(__dirname + "/database/products.json");

const socketProducts = (socketServer) => {
    socketServer.on("connection", async (socket) => {
        console.log("Cliente conectado con el Id:", socket.id);

        try {
            const listadeproductos = await PM.getProducts();
            socketServer.emit("enviodeproductos", listadeproductos);  // Se usa socketServer para emitir a todos
            console.log("enviodeproductos", listadeproductos);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }

        socket.on("addProduct", async (obj) => {
            try {
                await PM.addProduct(obj);
                const listadeproductos = await PM.getProducts();
                socketServer.emit("enviodeproductos", listadeproductos);  // Emitir a todos los clientes
                console.log(listadeproductos);
            } catch (error) {
                console.log("Error al agregar el producto", error);
            }
        });

        socket.on("deleteProduct", async (id) => {
            try {
                await PM.deleteProduct(id);
                const listadeproductos = await PM.getProducts();
                socketServer.emit("enviodeproductos", listadeproductos);  // Emitir a todos los clientes
            } catch (error) {
                console.log("Error al eliminar el producto", error);
            }
        });
    });
};

export default socketProducts;
