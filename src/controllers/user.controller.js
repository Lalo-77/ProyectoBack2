import userService from "../services/user.service.js";
import jwt from "jsonwebtoken";
import UserDTO from "../dto/user.dto.js";

class UserController {
    async register(req, res) {
        const {first_name, last_name, email, age, password} = req.body;

        try {
            const nuevoUsuario = await userService.registerUser({
            first_name, 
            last_name,
            email,
            age,
            password,
        }); 

            const token = jwt.sign(
                {
                usuario: `${nuevoUsuario.first_name} ${nuevoUsuario.last_name}`,
                email: nuevoUsuario.email,
                role: nuevoUsuario.role || "user",

            },
            process.env.JWT_SECRET ||"codehouse",
             {expiresIn: "1h"}
            );

            res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});
            res.redirect("/api/session/current");

        } catch (error) {  
            console.log("Error en el registro:", error);
            res.status(400).send(error.message || "Error al regitrar el usuario");
        }
    }
    async login(req, res) {  
        const { email, password } = req.body;  
    
        try {  
            const user = await userService.loginUser(email, password); 
            if(!user) {
                return res.status(401).send("Credenciales incorrectas")
            } 
            const token = jwt.sign(
                {  
                usuario: `${user.first_name} ${user.last_name}`,  
                email: user.email,  
                role: user.role  || "user",
            }, 
            process.env.JWT_SECRET || "coderhouse",
            { expiresIn: "1h" }
            );  
    
            res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});  
            res.redirect("/api/session/current");  

        } catch (error) {  
            console.log("Error en el login:", error);
            return res.status(500).send("Error del servidor:", + error.message);  
        }  
    }
}

export default new UserController();