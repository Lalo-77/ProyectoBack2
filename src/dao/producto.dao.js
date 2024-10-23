import ProductModel from "../models/product.model.js";

class ProductoDAO {
    async create(productData) {
        try {
            const newProduct = new ProductModel(productData);
            return await newProduct.save();
        } catch (error) {
            console.error("Error al crear producto", error);
            throw error;
        }
    }

    async getAll(filter = {}, options = {}) {
        try {
            return await ProductModel.paginate(filter, options);
        } catch (error) {
            console.error("Error al obtener los productos", error);
            throw error;
        }
    }

    async getById(id) {
        try {
            return await ProductModel.findById(id);
        } catch (error) {
            console.error("Error al buscar producto por id", error);
            throw error;
        }
    }

    async update(id, updatedFields) {
        try {
            return await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });
        } catch (error) {
            console.error("Error al actualizar el producto", error);
            throw error;
        }
    }

    async delete(id) {
        try {
            return await ProductModel.findByIdAndDelete(id);
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            throw error;
        }
    }
}

export default new ProductoDAO();