var express = require('express');
var app = express();
var Factura = require('../models/factura');
var Cliente = require('../models/cliente');
var Usuario = require('../models/usuario');


app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarFacturas(busqueda, regex),
            buscarClientes(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                facturas: respuestas[0],
                clientes: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});


app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'facturas':
            promesa = buscarFacturas(busqueda, regex);
            break;

        case 'clientes':
            promesa = buscarClientes(busqueda, regex);
            break;
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: facturas, clientes, usuarios',
                error: { message: 'Tip de tabla/coleccion no valida' }
            });
    }
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            mensaje: 'Los tipos de busqueda solo son: facturas, clientes, usuarios',
            [tabla]: data
        });
    });
});


function buscarFacturas(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Factura.find({ nombre: regex })
            .populate('cliente').exec((err, facturas) => {
                if (err) {
                    reject('Error al cargar facturas', err);
                } else {
                    resolve(facturas);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({ nombre: regex })
            .populate('usuario').exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

function buscarClientes(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Cliente.find({ nombre: regex }, (err, clientes) => {
            if (err) {
                reject('Error al cargar clientes', err);
            } else {
                resolve(clientes);
            }
        });
    });
}

module.exports = app;