import { Router } from "express";
import { Admin } from "../middlewares/auth.js";
import ProductoController from "../controllers/producto.controller.js";

const productoController = new ProductoController();

export const router = Router();

router.get("/", productoController.getProducts); 
router.get("/:id", productoController.getProductById); 
router.post("/", productoController.addProducts); 
router.put("/:id", Admin, productoController.updateProducts); 
router.delete("/:id", Admin, productoController.deleteProduct); 

export default router;
