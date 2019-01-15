var express = require('express'); 
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');
var app = express();

// =======================
// SPECIFIC SEARCH
// =======================
app.get('/coleccion/:table/:search', (req, res) => {
    
    var table = req.params.table;
    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    switch (table) {
        case 'usuarios':
            promise = searchUsuario(regex);
            break;
        case 'hospitales':
            promise = searchHospital(regex);
            break;
        case 'medicos':
            promise = searchMedico(regex);
            break;
        default:
            res.status(400).json({
                ok: false,
                mensaje: 'No existe la colección ' + table,
                error: {message: 'Tipo de tabla/coleccion no válido'}
            });
    }

    promise.then(data =>{
        res.status(200).json({
            ok: true,
            mensaje: 'Petición realizada correctamente',
            [table]: data
        });
    });

});

// =======================
// GENERAL SEARCH
// =======================
app.get('/todo/:search', (req, res, next) => {

    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    Promise.all([searchHospital(regex), searchMedico(regex), searchUsuario(regex)])
        .then(generalRes => {
            res.status(200).json({
                ok: true,
                mensaje: 'Petición realizada correctamente',
                hospitales: generalRes[0],
                medicos: generalRes[1],
                usuarios: generalRes[2]
            });
        });
});

function searchHospital(regex){

    return new Promise((resolve, reject)=>{
        Hospital.find({ name: regex})
            .populate('usuario', 'name email')
            .exec((err, hospitales)=>{
            if(err){
                reject('Error al cargar hospitales', err);
            }else{
                resolve(hospitales);
            }
        });
    });

}

function searchMedico(regex){

    return new Promise((resolve, reject)=>{
        Medico.find({ name: regex})
            .populate('usuario', 'name email')
            .populate('hospital')
            .exec( (err, medicos)=>{
            if(err){
                reject('Error al cargar medicos', err);
            }else{
                resolve(medicos);
            }
        });
    });
    
}

function searchUsuario(regex){

    return new Promise((resolve, reject)=>{
        Usuario.find({}, 'name email role img')
            .or([{ 'name': regex}, {'email': regex }])
            .exec((err, usuarios) => {
                if(err){
                    reject('Error al cargar usuarios', err);
                }else{
                    resolve(usuarios);
                }
            });
    });
    
}

module.exports = app;