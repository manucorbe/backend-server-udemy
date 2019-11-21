var express = require('express');
var app = express();
var Factura = require('../models/factura');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion');


//OBTENER TODAS LAS FACTURAS
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Factura.find({})
        .skip(desde)
        .limit(5)
        .exec(
            (err, facturas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando facturas',
                        errors: err
                    });
                }
                Factura.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error contando facturas',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        facturas: facturas,
                        total: conteo
                    });
                });
            });
});
//OBTENER UNA FACTURA POR ID
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Factura.findById(id, (err, factura) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar factura por ID',
                errors: err
            });
        }
        if (!factura) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El factura con el id ' + id + ' no existe',
                errors: { message: 'No existe un factura con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            factura: factura
        });
    });
});

//CREAR UNA NUEVA FACTURA
app.post('/', (req, res) => {
    var body = req.body;
    var factura = new Factura({
        nombre: body.nombre,
        fecha: body.fecha,
        numero: body.numero,
        producto: body.producto,
        cantidad: body.cantidad,
        img: body.img,
        cliente: body.cliente
    });
    factura.save((err, facturaGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear factura',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            factura: facturaGuardada
        });
    });
});

//ACTUALIZAR UNA FACTURA
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Factura.findById(id, (err, factura) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar factura por ID',
                errors: err
            });
        }
        if (!factura) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La factura con el id ' + id + ' no existe',
                errors: { message: 'No existe una factura con ese ID' }
            });
        }
        factura.nombre = body.nombre;
        factura.fecha = body.fecha,
            factura.numero = body.numero,
            factura.producto = body.producto,
            factura.cantidad = body.cantidad,
            factura.img = body.img;
        factura.cliente = body.cliente;

        factura.save((err, facturaGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar la factura',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                factura: facturaGuardado
            });
        });
    });
});


//BORRAR FACTURA
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Factura.findByIdAndRemove(id, (err, facturaBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar factura',
                errors: err
            });
        }
        if (!facturaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La factura con el id ' + id + ' no existe',
                errors: { message: 'No existe una factura con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            factura: facturaBorrado
        });
    });
});


module.exports = app;