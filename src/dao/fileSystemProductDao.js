import fs from "fs";
class FileSystemProductDAO {
    async crearProduct(datosProduct){
      try {
         const products = await this.leerArchivo();

         products.push(datosProduct);

         await this.escribirArchivo(products);
         return datosProduct;

      } catch (error) {
          throw new Error ("Error al crear el producto en archivo");
      }
    }
    async obtenerProducts(){
       try {
        const products = await this.leerArchivo();
        return products; 
       } catch (error) {
        throw new Error("Error al obtener el producto del archivo");
       }
    }
    async leerArchivo(){
         try {
              const data = await fs.promises.readFile("./src/data");
              return JSON.parce(data);
         } catch (error) {
              throw new Error("Error al leer el archivo de productos");
         }
    }
    async escribirArchivo(data){
        try {
          await fs.promises.writeFile("./src/data", JSON.stringify(data, null, 2));
        } catch (error) {
          throw new Error("Error al escribir el archivo de  productos");
        }
    }
}

export default FileSystemProductDAO;