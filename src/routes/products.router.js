import { Router } from "express";
import ProductsManager from "../controllers/ProductManager.js";
import productModel from "../models/product.model.js";

const router = Router();

const productsManager = new ProductsManager();

router.get("/", async (req, res) => {  
    const { limit = 10, page = 1, query = '', sort } = req.query;  

    const options = {  
        page: parseInt(page),  
        limit: parseInt(limit),  
        sort: sort === 'desc' ? { precio: -1 } : (sort === "asc" ? { precio: 1 } : {}),
    };  

    let filter = {};  
    if (query) {  
        filter.category = query;  
    }  

    try {  
        const result = await productModel.paginate(filter, options);  

        res.json({  
            status: 'success',  
            payload: result.docs,  
            totalPages: result.totalPages,  
            prevPage: result.prevPage,  
            nextPage: result.nextPage,  
            page: result.page,  
            hasPrevPage: result.hasPrevPage,  
            hasNextPage: result.hasNextPage,  
            prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort || ''}&query=${query}` : null,  
            nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort || ''}&query=${query}` : null,  
        });  

    } catch (error) {  
        console.error("Error al obtener productos", error);  
        res.status(500).json({ status: 'error', message: error.message });  
    }  
});  

router.get("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
      const producto = await productsManager.getProductById(id);
      if (!producto) {
          return res.json({
              error: "Producto no encontrado"
          });
      }

      res.json(producto);
  } catch (error) {
      console.error("Error al obtener producto", error);
      res.status(500).json({
          error: "Error interno del servidor"
      });
  }
});

router.post("/", async (req, res) => {  
    const nuevoProducto = req.body;  

    try {  
        await productsManager.addProduct(nuevoProducto);  
        res.status(201).json({  
            message: "Producto agregado exitosamente"  
        });  
    } catch (error) {  
        console.error("Error al agregar producto", error);  
        res.status(500).json({ error: "Error interno del servidor" });  
    }  
});

router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const productoActualizado = req.body;

  try {
      await ProductsManager.updateProduct(id, productoActualizado);
      res.json({
          message: "Producto actualizado exitosamente"
      });
  } catch (error) {
      console.error("Error al actualizar producto", error);
      res.status(500).json({
          error: "Error interno del servidor"
      });
  }
});

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
      await ProductsManager.deleteProduct(id);
      res.json({
          message: "Producto eliminado exitosamente"
      });
  } catch (error) {
      console.error("Error al eliminar producto", error);
      res.status(500).json({
          error: "Error interno del servidor"
      });
  }
  router.post("products", (req, res) => {
    try {
      const {title, description, price, thumbnail, code, stock} =  req.body;
      ProductsManager.addProduct(title, description, price, thumbnail, code, stock);
      res.status(201).send({ message: "Producto agregado con exito" });
    } catch (error) {
      res.status(400).send({ error: error.message});
    }
  })
});

export default router;