var express = require("express");
var Medico = require("../models/medico");
var Hospital = require("../models/hospital");
var Usuario = require("../models/usuario");
var bcrypt = require("bcryptjs");
var mdAuth = require("../middlewares/mdAuth");
var app = express();

// =======================
// GET MEDICOS
// =======================
app.get('/', (req, res) => {
    Medico.find().exec((err, medicos)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: "Error cargando medicos", 
                errors: err
              });
        }

        res.status(200).json({
            ok: true,
            medicos: medicos
          });
    });
});

// =======================
// CREATE MEDICO
// =======================
app.post('/', mdAuth.verifyToken, (req, res)=>{

    var body = req.body;

    var medico = new Medico({
        name: body.name,
        img: body.img,
        usuario: '5b9ecae7c1d72a23ec70c3f7',
        hospital: '5b9ecae7c1d72a23ec70c3f7'
    });

    medico.save((err, medicoSaved)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: "Error guardando el medico", 
                errors: err
              });
        }

        res.status(201).json({
            ok: true,
            medico: medicoSaved
          });
    });
});

// =======================
// UPDATE MEDICO
// =======================
app.put('/:id', mdAuth.verifyToken, (req, res)=>{

    var id = req.params.id;
    var body = req.body;

    Medico.findById( id, (err, medico) => {
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Error buscando el medico", 
                errors: err
              });
        }

        if(!medico){
            return res.status(400).json({
                ok: false,
                message: "No se encontró ningún medico", 
                errors: {message : "No se encontró ningún medico con el id: " + id}
              });
        }

        medico.name = body.name;
        if (body.img) medico.img = body.img;

        medico.save((err, medicoUpdated)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    message: "Error actualizando el medico", 
                    errors: err
                  });
            }

            res.status(200).json({
                ok: true,
                medico: medicoUpdated
              });
        })
        
    })
    
});

// =======================
// DELETE MEDICO
// =======================
app.delete('/:id', mdAuth.verifyToken, (req, res)=>{

    var id = req.params.id;

    Medico.findByIdAndRemove( id, (err, medico) => {
        if(err){
            return res.status(500).json({
                ok: false,
                message: "Error eliminando el medico", 
                errors: err
              });
        }

        if(!medico){
            return res.status(400).json({
                ok: false,
                message: "No se encontró ningún medico", 
                errors: {message : "No se encontró ningún medico con el id: " + id}
              });
        }

        res.status(200).json({
            ok: true,
            medico: medico
          });
        
    })
    
});

module.exports = app;
