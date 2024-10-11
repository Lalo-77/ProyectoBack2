import { Router } from "express";
import ProductsManager from "../controllers/ProductManager.js";
const productsManager = new ProductsManager();

const router = Router();

router.get("/", async (req, res) => {
  try {
      const { limit = 10, page = 1, sort, query } = req.query;

      const productos = await productsManager.getProducts({
          limit: parseInt(limit),
          page: parseInt(page),
          sort,
          query,
      });

      res.json({
          status: 'success',
          payload: productos,
          totalPages: productos.totalPages,
          prevPage: productos.prevPage,
          nextPage: productos.nextPage,
          page: productos.page,
          hasPrevPage: productos.hasPrevPage,
          hasNextPage: productos.hasNextPage,
          prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
          nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
      });

  } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
          status: 'error',
          error: "Error interno del servidor"
      });
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
      await addProduct(nuevoProducto);
      res.status(201).json({
          message: "Producto agregado exitosamente"
      });
  } catch (error) {
      console.error("Error al agregar producto", error);
      res.status(500).json({
          error: "Error interno del servidor"
      });
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