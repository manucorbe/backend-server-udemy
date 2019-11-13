var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var facturaSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: [true, 'El id del cliente es un campo obligatorio']
    }
}, { collection: 'facturas' });


facturaSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser unico" });
module.exports = mongoose.model('Factura', facturaSchema);