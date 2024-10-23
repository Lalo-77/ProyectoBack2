import ProductoDAO from "../dao/producto.dao.js";
import ProductoDTO from "../dto/producto.dto.js";
import ProductModel from "../models/product.model.js";
  
class ProductRepository {

    async getProductByCode(code) {
        return await ProductModel.findOne({ code: code }); 
    }
    async addProduct(productData) {
        const product = await ProductoDAO.create(productData);
        return new ProductoDTO(product);
    }

    async getProducts(filter = {}, options = {}) {
        const result = await ProductoDAO.getAll(filter, options);
        result.docs = result.docs.map(doc => new ProductoDTO(doc));
        return result;
    }

    async getProductById(id) {
        const product = await ProductoDAO.getById(id);
        return product ? new ProductoDTO(product) : null;
    }

    async updateProduct(id, updatedFields) {
        const product = await ProductoDAO.update(id, updatedFields);
        return product ? new ProductoDTO(product) : null;
    }

    async deleteProduct(id) {
        const product = await ProductoDAO.delete(id);
        return product ? new ProductoDTO(product) : null;
    }

    async getProductById(productId) {
        return await ProductModel.findById(productId);
    }

    async updateProduct(productId, updateData) {
        return await ProductModel.findByIdAndUpdate(productId, updateData, { new: true });
    }
}

export default new ProductRepository();
