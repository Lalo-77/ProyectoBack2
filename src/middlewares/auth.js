export function soloAdmin(req, res, next) {
    if(req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).send("Acceso denegado!! Solo ADMINISTRADORES");
    }
}

export function soloUser(req, res, next) {
    if(req.user && req.user.role === "user")  {
        next();
    } else {
        res.status(403).send("Acceso denegado!! Solo USUARIOS");
    }
}