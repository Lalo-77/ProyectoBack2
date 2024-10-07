import CartDao from "../dao/cart.dao.js";

class CartRepository {
    async createcart()  {
         return await CartDao.create();
    }
    // sumarle el resto de los metodos
}


export default new CartRepository();