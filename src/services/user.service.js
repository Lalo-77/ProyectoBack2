import UserRepository from "../repositories/User.Repository.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import CartRepository from "../repositories/Cart.Repository.js";

class UserService {
    async registerUser(userData) {
        const existeUsuario = await UserRepository.getUserByEmail(userData.email);
        userData.password = createHash(userData.password);
         
        return await UserRepository.createUser(userData);
        
        if (existeUsuario) throw new Error("El usuario ya existe");
        // CARRITO

        const nuevoCarrito = await CartRepository.createcart();

        userData.cart = nuevoCarrito._id;
        
///////////////////////////////////////////////////////////////
        userData.password = createHash(userData.password);
        return await UserRepository.createUser(userData);
    }

    async loginUser(email, password) {
        const user = await UserRepository.getUserByEmail(email);
        if (!user || !isValidPassword(password, user)) throw new Error("Credenciales incorrectas");
        return user;
    }
}

export default new UserService();