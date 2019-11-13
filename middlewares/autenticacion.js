var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


//VERIFICAR EL PTO TOKEN

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token expirado, se necesita autentificación',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};