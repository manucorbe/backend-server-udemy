var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var facturaSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    fecha: { type: Date, required: [true, 'La fecha es necesaria'] },
    numero: { type: Number, required: [true, 'El número es necesario'] },
    producto: { type: String, required: [true, 'El producto es necesario'] },
    cantidad: { type: Number, required: [true, 'La cantidad es necesario'] },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: [false]
    },
    img: { type: String, required: false }
}, { collection: 'facturas' });


facturaSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser unico" });
module.exports = mongoose.model('Factura', facturaSchema);