import MongoDBProductDAO from "../dao/mongoDBProductDao.js";
import mongoDBProductDAO from "../dao/mongoDBProductDao.js";
const productService = new MongoDBProductDAO();

class ProductoController {
    async getProductos(req, res){
        try {
            const products = await productService.obtenerProducts();
            res.json(products);
        } catch (error) {
            res.send("Error interno del servidor");
        }
    }

    async postProducto(req, res) {
        try {
            const product = await productService.crearProduct(req.body);
            res.json("Product");
        } catch (error) {
              res.send("Error interno del servidor");
        }
    }
}

export default ProductoController 