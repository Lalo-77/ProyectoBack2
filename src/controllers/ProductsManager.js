import fs from "fs";  
import ProductModel  from "../models/product.model.js";

class ProductsManager {  
    async addProduct(data) {  
        const { title, description, price, img, code, stock, category, thumbnails } = data;  

        try {  
            if (!title || !description || !price || !thumbnails || !code || !stock || !category) {  
                console.log("Todos los campos son obligatorios!!");  
                return;  
            }  

            const existeProducto = await ProductModel.findOne({ code: code });  

            if (existeProducto) {  
                console.log("El código debe ser único");  
                return;  
            }  

            const newProduct = new ProductModel({  
                title,  
                description,  
                price,  
                img,  
                code,  
                stock,  
                category,  
                status: true,  
                thumbnails: thumbnails || []  
            });  

            await newProduct.save();  
            console.log("Producto agregado con exito!!");  
        } catch (error) {  
            console.log("Error al agregar producto", error);  
            throw error; // Se debe manejar adecuadamente en el contexto de uso  
        }  
    }  

    async getProducts(filter = {}, options = {}) {  
        try {  
            const result = await ProductModel.paginate(filter, options);  
            return result.docs.map(doc => doc.toObject());  
        } catch (error) {  
            console.log("Error al obtener los productos", error);  
            throw error;  
        }  
    }  

    async getProductById(id) {  
        try {  
            const buscado = await ProductModel.findById(id);  

            if (!buscado) {  
                console.log("Producto no encontrado");  
                return null;  
            } else {  
                return buscado.toObject(); // Convierte a objeto  
            }  
        } catch (error) {  
            console.log("Error al buscar producto por id", error);  
            throw error;  
        }  
    }  

    async updateProduct(id, updatedFields) {  
        try {  
            const producto = await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });  
            if (!producto) {  
                console.log("No se encuentra el producto a actualizar");  
                return null;  
            } else {  
                console.log("Producto actualizado con éxito!!");  
                return producto.toObject(); // Convierte a objeto  
            }  
        } catch (error) {  
            console.log("Error al actualizar el producto", error);  
            throw error;  
        }  
    }  

    async deleteProduct(id) {  
        try {  
            const borrado = await ProductModel.findByIdAndDelete(id);  
            if (!borrado) {  
                console.log("No se encuentra el producto que se debe borrar");  
                return null;  
            } else {  
                console.log("Producto eliminado!");  
                return borrado.toObject(); // Convierte a objeto  
            }  
        } catch (error) {  
            console.log("Error al eliminar el producto", error);  
            throw error;  
        }  
    }  
}  

export default ProductsManager;