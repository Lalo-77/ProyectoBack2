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
    try {  
        // Desestructuramos limit pero el objeto es vacío en caso de no ser pasado  
        const { limit } = info;   
        
        if (fs.existsSync(this.path)) {  
            const productlist = await fs.promises.readFile(this.path, "utf-8");  
            const productlistJs = JSON.parse(productlist);  
            
            if (limit) {  
                const limitProducts = productlistJs.slice(0, parseInt(limit));  
                return limitProducts;  
            } else {  
                return productlistJs;  
            }  
        } else {  
            return [];  
        }  
    } catch (error) {  
        console.error(error); // Imprime el error en la consola  
        throw new Error("Error en getProducts: " + error.message); // Lanzar un nuevo error con el mensaje  
    }  
};

  // Cargar productos desde el archivo  
  loadProducts() {
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
      this.codeId = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 0;
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

  // Guardar productos en archivo después de agregarlos  
  }
  async saveProducts() {  
    try {  
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));  
    } catch (error) {  
      throw new Error('Error al guardar los productos en el archivo');  
    }  
  }
  // Obtener producto por Id  
  getProductById(id) {
    try {
      const product = this.products.find(product => product.id === id);
      if (product) {
        return product;
      } else {
        console.log("Producto no encontrado");
      }
    } catch (error) {
      console.log(error);
    }
  }
  // Actualizar un producto  
  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) {
      console.log(`El producto con ID ${id} no existe`);
      return;
    }
    this.products[index] = { ...this.products[index], ...updatedProduct };
    this.saveProducts(); // Guardar productos en archivo después de actualizar  
    return this.products[index];
  }

  // Eliminar un producto  
  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) throw new Error(`El producto con ID ${id} no existe`);
    this.products.splice(index, 1);
    this.saveProducts(); // Guardar productos en archivo después de eliminar  
  }

  // Guardar productos en archivo  
  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
  }
}

export default ProductManager;