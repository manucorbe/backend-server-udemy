var express = require('express');
var app = express();
var Comentario = require('../models/comentario');
var bcrypt = require('bcryptjs');

//OBTENER TODOS LOS COMENTARIOS
app.get('/', (req, res, next) => {
    Comentario.find({})
        .exec(
            (err, comentarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando comentarios',
                        errors: err
                    });
                }
                Comentario.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error contando comentarios',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        comentarios: comentarios,
                        total: conteo
                    });
                });
            });
});

//OBTENER UN COMENTARIO POR ID
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Comentario.findById(id, (err, comentario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar comentario por ID',
                errors: err
            });
        }
        if (!comentario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El comentario con el id ' + id + ' no existe',
                errors: { message: 'No existe un comentario con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            comentario: comentario
        });
    });
});

//CREAR UN NUEVO COMENTARIO
app.post('/', (req, res) => {
    var body = req.body;
    var comentario = new Comentario({
        titulo: body.titulo,
        comentario: body.comentario,
        usuario: body.usuario,
        likes: body.likes,
        dislikes: body.dislikes
    });
    comentario.save((err, comentarioGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear comentario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            comentario: comentarioGuardada
        });
    });
});

//ACTUALIZAR LIKES/DISLIKES COMENTARIO
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Comentario.findById(id, (err, comentario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar comentario por ID',
                errors: err
            });
        }
        if (!comentario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La comentario con el id ' + id + ' no existe',
                errors: { message: 'No existe una comentario con ese ID' }
            });
        }
        comentario.titulo = body.titulo;
        comentario.comentario = body.comentario,
            comentario.usuario = body.usuario,
            comentario.likes = body.likes,
            comentario.dislikes = body.dislikes,
            comentario.save((err, comentarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al actualizar la comentario',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    comentario: comentarioGuardado
                });
            });
    });
});


//BORRAR UN COMENTARIO
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Comentario.findByIdAndRemove(id, (err, comentarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar comentario',
                errors: err
            });
        }
        if (!comentarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La comentario con el id ' + id + ' no existe',
                errors: { message: 'No existe una comentario con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            comentario: comentarioBorrado
        });
    });
});


module.exports = app;