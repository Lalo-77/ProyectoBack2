
user.get("/user", (req, res) => {
    if(req.session.usuario) {
            return res.send(`El usuario registrado es el siguiente: ${req.session.usuario}`);
        }

        res.send("No tenemos un usuario registrado con ese nombre");
    })
    
    user.listen(PUERTO, () => {
        console.log(`Escuchando em el puerto ${PUERTO}`);
        
    })

export default user
