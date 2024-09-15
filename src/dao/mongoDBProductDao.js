class MongoDBProductDAO {

    async crearProduct(datos){
        try {
            const product = new ProductoModel(datos);
            return await product.save();
        } catch (error) {
            throw new Error("Error al crear el producto en MongoDB");
        }
    }
    async obtenerProducts(){
        try {
            return await ProductoModel.find();
        } catch (error) {
            throw new Error("Error al obtener los productos desde MongoDB");
        }
        
    }
}

export default MongoDBProductDAO;