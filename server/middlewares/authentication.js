const jwt = require('jsonwebtoken');

// ===============
// Verificar Token
// ===============
let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

// ====================
// Verificar Admin Role
// ====================
let verificaAdminRole = (req, res, next) => {

    const usuario = req.usuario;
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'No autorizado'
            }
        });
    }

    next();
}

module.exports = { verificaToken, verificaAdminRole };