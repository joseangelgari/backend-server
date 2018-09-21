var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    name: {type: String, required: [true, 'El nombre es necesario']},
    img: {type: String, required: false},
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'},
    hospital: {type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id del hospital es un campo obligatorio']},
});

module.exports = mongoose.model('Medico', medicoSchema); 