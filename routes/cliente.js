var express = require('express');
var app = express();
var Cliente = require('../models/cliente');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion');


//OBTENER TODOS LOS CLIENTES
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Cliente.find({})
        .skip(desde)
        .limit(5)
        .exec(
            (err, clientes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando clientes',
                        errors: err
                    });
                }
                Cliente.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error contando clientes',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        clientes: clientes,
                        total: conteo
                    });
                });
            });
});

//OBTENER UN CLIENTE POR ID
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Cliente.findById(id, (err, cliente) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente por ID',
                errors: err
            });
        }
        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cliente con el id ' + id + ' no existe',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            cliente: cliente
        });
    });
});

//CREAR UN NUEVO CLIENTE
app.post('/', (req, res) => {
    var body = req.body;
    var cliente = new Cliente({
        nombre: body.nombre,
        nif: body.nif,
        email: body.email,
        tlf: body.tlf,
        direccion: body.direccion,
        img: body.img
    });
    cliente.save((err, clienteGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear cliente',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            cliente: clienteGuardada
        });
    });
});

//ACTUALIZAR UN CLIENTE
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Cliente.findById(id, (err, cliente) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente por ID',
                errors: err
            });
        }
        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cliente con el id ' + id + ' no existe',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }
        cliente.nombre = body.nombre;
        cliente.nif = body.nif;
        cliente.email = body.email;
        cliente.tlf = body.tlf;
        cliente.direccion = body.direccion;
        cliente.img = body.img;

        cliente.save((err, clienteGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el cliente',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                cliente: clienteGuardado
            });
        });
    });
});

//BORRAR USUARIO
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Cliente.findByIdAndRemove(id, (err, clienteBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar cliente',
                errors: err
            });
        }
        if (!clienteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La cliente con el id ' + id + ' no existe',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            cliente: clienteBorrado
        });
    });
});


module.exports = app;