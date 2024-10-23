import UserDAO from "../dao/user.dao.js";
import UserDTO from "../dto/user.dto.js";
import UserModel from "../models/usuarios.model.js";

class UserRepository {
    async createUser (userData) {
        try {
            const user = new UserModel(userData);
            return await user.save();
        } catch (error) {
            console.error('Error al crear el usuario en la base de datos:', error.message);
            throw new Error(error);
        }
    }

    async getUserByEmail(email, includePassword = false) {
        const user = await UserDAO.findUserByEmail(email);
        if (!user) return null;
        return includePassword ? user : new UserDTO(user);
    }

    async getUserById(id) {
        const user = await UserDAO.findUserById(id);
        return user ? new UserDTO(user) : null;
    }
   
    async updateUser(id, updateData) {
        const updateUser = await UserDAO.updateUser(id, updateData);
        return updateUser ? new UserDTO(updateUser) : null;
    }
}

export default new UserRepository();