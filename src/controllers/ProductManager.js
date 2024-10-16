import fs from "fs";  

class ProductsManager {  
    constructor(path) {  
        this.path = path; // Ruta para el almacenamiento de archivos  
        this.products = [];  
        this.codeId = 0;  
        this.loadProducts(); // Cargar productos desde el archivo en la inicialización  
    }  

      // Cargar productos desde el archivo   
      loadProducts() {  
        if (fs.existsSync(this.path)) {  
            const data = fs.readFileSync(this.path, 'utf-8');  
            try {  
                this.products = JSON.parse(data);  
            } catch (error) {  
                console.error("Error al parsear JSON:", error);  
                this.products = []; 
            }  
            this.codeId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 0; // Asigna nuevo ID  
        }  
    }

    // Obtener todos los productos  
    getProducts = async (info = {}) => {  
        try {  
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
            throw new Error(error);  
        }  
    };

    // Obtener producto por Id  
    getProductById = async (id) => {
        try {
          const {pid}=id
          if (fs.existsSync(this.path)) {
            const allproducts = await this.getProducts({});
            const found = allproducts.find((element) => element.id === parseInt(pid));
            if (found) {
              return found;
            } else {
              throw new Error("Producto no existe");
            }
          } else {
            throw new Error("Product file not found");
          }
        } catch (error) {
          throw new Error(error);
        }
    };
    //GENERATE ID
      generateId = async () => {
        try {
          if (fs.existsSync(this.path)) {
            const productlist = await fs.promises.readFile(this.path, "utf-8");
            const productlistJs = JSON.parse(productlist);
            const counter = productlistJs.length;
            if (counter == 0) {
              return 1;
            } else {
              return productlistJs[counter - 1].id + 1;
            }
          }
        } catch (error) {
          throw new Error(error);
        }
      };
    
    // Agregar un producto  
   
    addProduct = async (obj) => {
        const {title, description, price, thumbnail, category, code, stock} = obj;
  
        if (!title || !description || !price || !category || !code || !stock) {
          console.error("INGRESE TODOS LOS DATOS DEL PRODUCTO");
          return { error: "todos los campos son obligatorios" };
        }

          const listadoProductos=await this.getProducts();
          console.log("Producto a agregar:", { title, description, price, thumbnail, category, code, stock });  
          console.log("Listado actual de productos:", listadoProductos);
          
          const codigorepetido = listadoProductos.find((elemento) => elemento.code === code);
          if (codigorepetido) {
            console.error("EL CODIGO DEL PRODUCTO QUE DESEA AGREGAR ES REPETIDO");
            return {error: "El codigo del producto es reopetido"};
          } 
           
            const id = await this.generateId();
            const productnew = {
              id,
              title: title,
              description: description,
              price: price,
              category: category,
              thumbnail: thumbnail,
              code: code,
              stock: stock,
            };

            listadoProductos.push(productnew);
            await fs.promises.writeFile(this.path, JSON.stringify(listadoProductos, null, 2));
            console.log("Producto agregado correctamente:", productnew);
        };

    // Actualizar un producto  
    updateProduct = async (id,obj) => {
        const {pid}=id
        const {title, description, price, category,thumbnail,code, stock}=obj
             if(title===undefined || description===undefined || price===undefined || category===undefined || code===undefined||stock===undefined){
          console.error("INGRESE TODOS LOS DATOS DEL PRODUCTO PARA SU ACTUALIZACION");
          return;
        } else {
          const listadoProductos = await this.getProducts({});
          const codigorepetido = listadoProductos.find( (i) => i.code === code);
          if (codigorepetido) {
            console.error(
              "EL CODIGO DEL PRODUCTO QUE DESEA ACTUALIZAR ES REPETIDO"
            );
            return;
          } else {
            const listadoProductos = await this.getProducts({});
            const newProductsList = listadoProductos.map((elemento) => {
              if (elemento.id === parseInt(pid)) {
                        const updatedProduct = {
                          ...elemento,
                          title,
                          description,
                          price,
                          category,
                          thumbnail,
                          code,
                          stock
                        };
                return updatedProduct;
              } else {
                return elemento;
              }
            });
            await fs.promises.writeFile(this.path,JSON.stringify(newProductsList, null, 2));
          }
        }
      };

       //DELETE
       deleteProduct = async (id) => {  
        try {  
            const allproducts = await this.getProducts({});  
            console.log("Todos los productos:", allproducts); // Muestra la lista de productos por consola  
    
            const productswithoutfound = allproducts.filter(  
                (elemento) => elemento.id !== parseInt(id)  
            );  
    
            await fs.promises.writeFile(this.path, JSON.stringify(productswithoutfound, null, 2));  
            return "Producto Eliminado";  
        } catch (error) {  
            console.error("Error al eliminar el producto:", error);  
            return "Error al eliminar el producto";  
        }  
    };
    
}  

export default ProductsManager;