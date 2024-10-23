import UserRepository from "../repositories/user.Repository.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import CartRepository from "../repositories/cart.repository.js";

class UserService {
    async registerUser(userData) {
        try {
            const { first_name, last_name, email, password, age, role } = userData;
    
            const existingUser = await UserRepository.getUserByEmail(email);
            if (existingUser) {
                throw new Error('El Usuario ya existe');
            }
    
            const newCart = await CartRepository.createCart();

            const hashedPassword = createHash(password);
            const newUser = {
                first_name,
                last_name,
                email,
                password: hashedPassword,
                age,
                role,
                cart_id: newCart._id,  
            };
    
            const userCreated = await UserRepository.createUser(newUser);
        
            if (!userCreated) {
                throw new Error('Error al crear el usuario en la base de datos');
            }
    
            return userCreated;
        } catch (error) {
            console.error('Error en registerUser:', error.message);
            throw new Error(`Error al registrar usuario: ${error.message}`);
        }
    }
    
    async loginUser(email, password) {
        try {
            const user = await UserRepository.getUserByEmail(email, true);
            if (!user) throw new Error("Usuario no encontrado");
            if (!isValidPassword(password, user)) throw new Error("Contraseña incorrecta");

            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            throw new Error(`Error en el login: ${error.message}`);
        }
    }

    async getUserByEmail(email) {
        try {
            return await UserRepository.getUserByEmail(email);
        } catch (error) {
            throw new Error(`Error al obtener usuario por email: ${error.message}`);
        }
    }

    async getUserById(id) {
        try {
            const user = await UserRepository.getUserById(id);
            if (!user) throw new Error("Usuario no encontrado");
            return user;
        } catch (error) {
            throw new Error(`Error al obtener usuario por ID: ${error.message}`);
        }
    }
}

export default new UserService();