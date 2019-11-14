var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;



//GOOGLE
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//AUTENTICACION GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        google: true,
        email: payload.email,
        img: payload.picture
    };
}
app.post('/google', async(req, res) => {
    var token = req.body.token;
    var googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            mensaje: 'Token no valido'
        });
    });
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (usuarioDB) {
            if (usuarioDB.google == false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario debe usar su autenticacion normal'
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas de token
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id,
                });
            }
        } else {
            //EL USUARIO NO EXISTE...HAY QUE CREARLO
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':D';
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar usuario',
                        errors: err
                    });
                }
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas de token
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB.id,
                });
            });
        }

    });

    return res.status(200).json({
        ok: true,
        mensaje: 'OK',
        googleUser: googleUser
    });
});


app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        //Comprobacion de error general
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        //Si no encuentra ningun usuario con ese email
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Coincidencia incorrecta - Email',
                errors: err
            });
        }

        //Hay que comprobar la contraseña de usuarioDB
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Coincidencia incorrecta - Password',
                errors: err
            });
        }

        //Crear el token de sesion de usuario
        usuarioDB.password = ':D';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas de token
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id,
        });
    });










});

















module.exports = app;