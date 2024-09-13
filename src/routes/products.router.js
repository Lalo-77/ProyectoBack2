import { Router } from "express";


const router = Router;

class ProductManager {
    constructor() {
      this.products = [];
      this.idCounter = 0;
    }
  
    addProduct(title, description, price, thumbnail, code, stock) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].code === code) {
          throw new Error(`El código ${code} ya existe`);
        }
      }
  
      const newProduct = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
  
      if (!Object.values(newProduct).every((value) => value !== undefined)) {
        throw new Error("Todos los campos son requeridos");
      }
  
      this.idCounter++;
  
      this.products.push({
        ...newProduct,
        id: this.idCounter,
      });
    }
  
    getProducts() {
      return this.products;
    }
  
    FoundIt(id) {
      return this.products.find((existingProduct) => existingProduct.id === id);
    }
  
    getProductById(id) {
      const product = this.FoundIt(id);
  
      if (!product) {
        throw new Error("No tenemos este servicio");
      }
  
      console.log(`Producto encontrado: ${JSON.stringify(product)}`);
      return product;
    }
  }

export default router;
