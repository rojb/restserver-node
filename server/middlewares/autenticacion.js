const jwt = require('jsonwebtoken');

// =================
// Verificar token
// =================

let verificaToken = (req, res, next) => {

    let token = req.get('auth');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};
// ====================
// Verificar Admin_Role
// ====================
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {

        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No es administrador'
            }
        });
    }
}

// ====================
// Verificar token url
// ====================

let verificaTokenImg = (req, res, next) => {
    let token = req.query.auth;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

}
module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}