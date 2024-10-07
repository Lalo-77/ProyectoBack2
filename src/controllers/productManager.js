import fs from "fs";  

class ProductManager {  
    constructor(path) {  
        this.path = path; // Ruta para el almacenamiento de archivos  
        this.products = [];  
        this.codeId = 0;  
        this.loadProducts(); // Cargar productos desde el archivo en la inicialización  
    }  

    // Obtener todos los productos  
    getProducts = async (info = {}) => { // Establece un objeto vacío por defecto    
        const { limit } = info;  
        if (limit) {  
            return this.products.slice(0, parseInt(limit));  
        } else {  
            return this.products;  
        }  
    };  

    // Cargar productos desde el archivo   
    loadProducts() {  
        if (fs.existsSync(this.path)) {  
            const data = fs.readFileSync(this.path, 'utf-8');  
            this.products = JSON.parse(data);  
            this.codeId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 0; // Asigna nuevo ID  
        }  
    }  

    // Agregar un producto  
    async addProduct(title, description, stock, thumbnail, category, price, code) {  
        // Verificación de campos obligatorios  
        if (!title || !description || stock === null || stock === undefined || !thumbnail || !category || price === null || price === undefined || !code) {  
            throw new Error("Todos los campos son obligatorios");  
        }  
        // Comprobar si ya existe un producto con el mismo código  
        if (this.products.some(product => product.code === code)) {  
            throw new Error("Error: Ya existe un producto con el mismo código");  
        }  

        // Crear el nuevo producto  
        const product = {  
            id: this.codeId++, // Asume que codeId está definido en alguna parte del objeto  
            title,  
            description,  
            code,  
            price,  
            stock,  
            category,  
            thumbnail,  
        };  

        this.products.push(product);  
        await this.saveProducts(); // Guardar productos en archivo después de agregarlos  
    }  

    // Función para guardar productos en archivo  
    async saveProducts() {  
        try {  
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));  
        } catch (error) {  
            throw new Error('Error al guardar los productos en el archivo');  
        }  
    }  

    // Obtener producto por Id  
    getProductById(id) {  
        try {  
            const product = this.products.find(product => product.id === parseInt(id));  
            if (product) {  
                return product;  
            } else {  
                throw new Error("Producto no encontrado");  
            }  
        } catch (error) {  
            console.error(error);  
        }  
    }  

    // Actualizar un producto  
    async updateProduct(id, updatedProduct) {  
        const index = this.products.findIndex(product => product.id === id);  
        if (index === -1) {  
            throw new Error(`El producto con ID ${id} no existe`);  
        }  
        this.products[index] = { ...this.products[index], ...updatedProduct };  
        await this.saveProducts(); // Guardar productos en archivo después de actualizar  
        return this.products[index];  
    }  

    // Eliminar un producto  
    async deleteProduct(id) {  
        const index = this.products.findIndex(product => product.id === id);  
        if (index === -1) throw new Error(`El producto con ID ${id} no existe`);  
        this.products.splice(index, 1);  
        await this.saveProducts(); // Guardar productos en archivo después de eliminar  
    }  
}  

export default ProductManager;