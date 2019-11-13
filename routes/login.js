var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


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