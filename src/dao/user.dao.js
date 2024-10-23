import UsuarioModel from "../models/usuarios.model.js";

class UserDAO {
    async findUserByEmail(email) {
        return await UsuarioModel.findOne({ email }).lean();
    }

    async findUserById(id) {
        return await UsuarioModel.findById(id).lean();
    }

    async createUser(userData) {
        const newUser = new UsuarioModel(userData);
        return await newUser.save();
    }
    async updateUser(id, updateData) {
        return await UsuarioModel.findByIdAndUpdate(id, updateData, { new: true });
    }
}

export default new UserDAO();