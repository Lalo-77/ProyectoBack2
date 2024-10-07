import dotenv from "dotenv"; 

const {mode} = program.opts(); 

dotenv.config({
    path: mode === "desarrollo"?"./.env.desarrollo":""
}); 

const configObject = {
    PUERTO: process.env.PUERTO, 
    MONGO_URL: process.env.MONGO_URL
}

export default configObject; 

