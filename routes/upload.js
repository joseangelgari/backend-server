var express = require('express');
const fileUpload = require('express-fileupload'); 
var app = express();

app.use(fileUpload());

app.post('/', (req, res, next) => {

    if(!req.files){
        res.status(400).json({
            ok: true,
            mensaje: 'No seleccionó ningún archivo',
            error: {message: 'Debe seleccionar una imagen'}
        });
    }

    // Get ext file
    var file = req.files.img;
    var nameCuted = file.name.split('.');
    var extFile = nameCuted[nameCuted.length -1];

    // Validate ext
    var extValid = ['png', 'jpg', 'jpeg', 'gif'];

    if(extValid.indexOf(extFile) < 0){
        res.status(400).json({
            ok: true,
            mensaje: 'Extensión no válida',
            error: {message: 'Extensión no válida. Puedes seleccionar imágenes tipo: ' + extValid.join(', ')}
        });
    }
    

    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente',
        extFile: extValid.indexOf(extFile)
    });
});

module.exports = app;