var express = require('express');
var fs = require('fs');
const fileUpload = require('express-fileupload'); 
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

var app = express();

app.use(fileUpload());

app.put('/:table/:id', (req, res, next) => {

    var table = req.params.table;
    var id = req.params.id;

    // Validate table
    var tableValid = ['usuarios', 'hospitales', 'medicos'];
    if(tableValid.indexOf(table) < 0){
         return res.status(400).json({
            ok: true,
            mensaje: 'Colección no válida',
            error: {message: 'Colección no válida. Puedes seleccionar colecciones tipo: ' + tableValid.join(', ')}
        });
    }

    // Validate file exist
    if(!req.files){
        return res.status(400).json({
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
        return res.status(400).json({
            ok: true,
            mensaje: 'Extensión no válida',
            error: {message: 'Extensión no válida. Puedes seleccionar imágenes tipo: ' + extValid.join(', ')}
        });
    }

    // Rename image : 123456789-123.ext
    var nameFile = `${id}-${new Date().getMilliseconds()}.${extFile}`;

    // Move file from temporal to path
    var path = `./uploads/${table}/${nameFile}`;
    file.mv(path, err =>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        uploadByTable(table, id, nameFile, res);

    });

    function uploadByTable(table, id, nameFile, res){
        
        if(table === 'usuarios'){

	        Usuario.findById( id, (err, usuario)=>{
                if(err){
                    fs.unlink(path, (err) => {
                        if(err){
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error eliminando imagen del usuario erróneo',
                                errors: err,
                            });
                        }
                    });
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Usuario no encontrado',
                        errors: err,
                    });
                }
                var oldPath = './uploads/usuarios/' + usuario.img;
              
                if(fs.existsSync(oldPath)){
                    fs.unlink(oldPath, (err) => {
                        if(err){
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error eliminando imagen',
                                errors: err,
                            });
                        }
                    });
                }

                usuario.img = nameFile;

                usuario.save((err, usuarioUpdated)=>{
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error actualizando imagen en el usuario',
                            errors: err,
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Petición realizada correctamente',
                        usuario: usuarioUpdated
                    });

                });

            });
        }

        if(table === 'medicos'){

	        Medico.findById( id, (err, medico)=>{
                if(err){
                    fs.unlink(path, (err) => {
                        if(err){
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error eliminando imagen del medico erróneo',
                                errors: err,
                            });
                        }
                    });
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'medico no encontrado',
                        errors: err,
                    });
                }
                var oldPath = './uploads/medicos/' + medico.img;
              
                if(fs.existsSync(oldPath)){
                    fs.unlink(oldPath, (err) => {
                        if(err){
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error eliminando imagen',
                                errors: err,
                            });
                        }
                    });
                }

                medico.img = nameFile;

                medico.save((err, medicoUpdated)=>{
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error actualizando imagen en el medico',
                            errors: err,
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Petición realizada correctamente',
                        medico: medicoUpdated
                    });

                });

            });
        }

        if(table === 'hospitales'){

	        Hospital.findById( id, (err, hospital)=>{
                if(err){
                    fs.unlink(path, (err) => {
                        if(err){
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error eliminando imagen del hospital erróneo',
                                errors: err,
                            });
                        }
                    });
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'hospital no encontrado',
                        errors: err,
                    });
                }
                var oldPath = './uploads/hospitales/' + hospital.img;
              
                if(fs.existsSync(oldPath)){
                    fs.unlink(oldPath, (err) => {
                        if(err){
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error eliminando imagen',
                                errors: err,
                            });
                        }
                    });
                }

                hospital.img = nameFile;

                hospital.save((err, hospitalUpdated)=>{
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error actualizando imagen en el hospital',
                            errors: err,
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Petición realizada correctamente',
                        hospital: hospitalUpdated
                    });

                });

            });
        }
        
    }
    
});

module.exports = app;