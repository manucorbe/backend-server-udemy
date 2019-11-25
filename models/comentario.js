var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var comentarioSchema = new Schema({

    titulo: { type: String, required: [true, 'El titulo es necesario'] },
    comentario: { type: String, required: [true, 'El comentario es necesario'] },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true]
    },
    likes: { type: Number, required: false, default: 0 },
    dislikes: { type: Number, required: false, default: 0 }
}, { collection: 'comentarios' });


comentarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser unico" });
module.exports = mongoose.model('Comentario', comentarioSchema);