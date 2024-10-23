import ProductRepository from "../repositories/product.repository.js";

class ProductoService {
    async addProduct(productData) {
        if (!productData.title || !productData.description || !productData.price || 
            !productData.code || !productData.stock || !productData.category) {
            throw new Error("Todos los campos son obligatorios");;
        }

        const existingProduct = await this.getProductByCode(productData.code);
        if (existingProduct) {
            throw new Error("El código debe ser único");
        }

        return await ProductRepository.addProduct({
            ...productData,
            status: true,
            thumbnails: productData.thumbnails || []
        });
    }

    async getProducts(filter, options) {
        try {
            const products = await ProductRepository.getProducts(filter, options);
            return products;
        } catch (error) {
            throw new Error("Error en ProductService: " + error.message);
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductRepository.getProductById(id);
            if (!product) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }
            return product;
        } catch (error) {
            throw new Error(`Error al obtener el producto con ID ${id}: ${error.message}`);
        }
    }
    
    async updateProduct(id, updatedFields) {
        const product = await ProductRepository.updateProduct(id, updatedFields);
        if (!product) {
            throw new Error("No se encuentra el producto a actualizar");
        }
        return product;
    }

    async deleteProduct(id) {
        try {
            const product = await ProductRepository.deleteProduct(id);
            if (!product) {
                throw new Error(`No se encuentra el producto con ID ${id} que se debe borrar`);
            }
            return { message: `Producto con ID ${id} eliminado`, product };
        } catch (error) {
            throw new Error(`Error al eliminar el producto con ID ${id}: ${error.message}`);
        }
    }    

    async getProductByCode(code) {
        const products = await this.getProducts({ code: code }, { limit: 1 });
        return products.docs[0] || null;
    }
}

export default new ProductoService();
