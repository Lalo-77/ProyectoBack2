class MemoryProductDAO {
    constructor() {
        this.products = [];
    }

    async crearProduct(){
        try {
            this.products.push(datosProduct);
            return datosProduct;
        } catch (error) {
            throw new Error("Error sl crear el producto en memoria");
        }
    }
    async obtenerProducts(){
       try {
        return this.products;
       } catch (error) {
         throw new Error("Error al obtener los productos en memoria");
       }
    }
}

export default MemoryProductDAO;