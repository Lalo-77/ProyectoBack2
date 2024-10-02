import UserDao from "../dao/user.dao.js";

class UserRepository {
    async createUser(userData) {
        return await UserDao.save(userData);
    }

    async getUserById(id){
        return await UserDao.findById(id);
    }
    async getUserByEmail(email){
        return await UserDao.finOne({email}); 
    }
}

export default new UserRepository();