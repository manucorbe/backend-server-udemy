var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var clienteSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    tlf: { type: String, required: [true, 'El telefono es necesario'] },
    img: { type: String, required: false }
}, { collection: 'clientes' });


clienteSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser unico" });
module.exports = mongoose.model('Cliente', clienteSchema);