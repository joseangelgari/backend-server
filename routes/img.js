var express = require('express'); 
var fs = require('fs');
var app = express();

app.get('/:table/:img', (req, res, next) => {

    var table = req.params.table;
    var img = req.params.img;
    
    var tableValid = ['medicos', 'usuarios', 'hospitales'];

    if(tableValid.indexOf(table) < 0){
        return res.status(400).json({
                ok: false,
                mensaje: 'Colección no válida',
                error: {message: 'Colección no válida. Puedes seleccionar colecciones tipo: ' + tableValid.join(', ')}
            });
    }

    var path = `./uploads/${ table }/${ img }`;

    fs.exists(path, existe => {
        if(!existe){
            path = './assets/no-image.png';
        }

        res.sendfile(path);
    });
});

module.exports = app; 