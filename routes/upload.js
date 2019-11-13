var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var Factura = require('../models/factura');
var Usuario = require('../models/usuario');
var Cliente = require('../models/cliente');
var fs = require('fs');

app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;


    //VALIDACION DE LA COLECCION
    var tiposValidos = ['usuarios', 'clientes', 'facturas'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no valida',
            errors: { message: 'Tipo de coleccion no valida' }
        });
    }

    //VALIDACION DE IMAGEN
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    //OBTENER NOMBRE DEL ARCHIVO
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //VALIDACION DE EXTENSINO
    var extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Solo se permiten las siguientes extensiones: ' + extensionesValidas.join(', ') }
        });
    }

    //NOMBRE ARCHIVO PERSONALIZADO
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //MOVER EL ARCHIVO TEMPORAL AL SITIO ESPECIFICO
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido correctamente'
        // });
    });



});


function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al consultar el usuario',
                    errors: err
                });
            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            //SI EXISTE ELIMINA LA IMG ANTERIOR
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar el usuario',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }
    if (tipo === 'clientes') {
        Cliente.findById(id, (err, cliente) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al consultar el cliente',
                    errors: err
                });
            }
            var pathViejo = './uploads/clientes/' + cliente.img;
            //SI EXISTE ELIMINA LA IMG ANTERIOR
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            cliente.img = nombreArchivo;
            cliente.save((err, clienteActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar el cliente',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de cliente actualizada',
                    cliente: clienteActualizado
                });
            });
        });
    }
    if (tipo === 'facturas') {
        Factura.findById(id, (err, factura) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al consultar la factura',
                    errors: err
                });
            }
            var pathViejo = './uploads/facturas/' + factura.img;
            //SI EXISTE ELIMINA LA IMG ANTERIOR
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            factura.img = nombreArchivo;
            factura.save((err, facturaActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al actualizar la factura',
                        errors: err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de factura actualizada',
                    factura: facturaActualizado
                });
            });
        });
    }





}




module.exports = app;