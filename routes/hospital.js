var express = require("express");
var Hospital = require("../models/hospital");
var mdAuth = require("../middlewares/mdAuth");
var app = express();

// =======================
// GET HOSPITAL
// =======================
app.get('/', (req, res) => {
    Hospital.find()
        .populate('usuario', 'name email img')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando hospitales",
                    errors: err
                });
            }

            Hospital.count({}, (err, cantity) => {
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: cantity
                });
            })
        });
});

// =======================
// GET HOSPITAL BY ID
// =======================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Hospital.findById(id)
        .populate('usuario', 'name email img google role')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error cargando el hospital",
                    errors: err
                });
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error cargando el hospital con el id:" + id,
                    errors: { message: 'No existe un hospital con ese id.' }
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospital
            });
        });
});

// =======================
// CREATE HOSPITAL
// =======================
app.post('/', mdAuth.verifyToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        name: body.name,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalSaved) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error guardando hospital",
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalSaved
        });
    });
});

// =======================
// UPDATE HOSPITAL
// =======================
app.put('/:id', mdAuth.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error buscando el hospital",
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: "No se encontró ningún hospital",
                errors: { message: "No se encontró ningún hospital con el id: " + id }
            });
        }

        hospital.name = body.name;
        hospital.usuario = req.usuario._id;
        if (body.img) hospital.img = body.img;

        hospital.save((err, hospitalUpdated) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error actualizando el hospital",
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalUpdated
            });
        })

    })

});

// =======================
// DELETE HOSPITAL
// =======================
app.delete('/:id', mdAuth.verifyToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error eliminando el hospital",
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: "No se encontró ningún hospital",
                errors: { message: "No se encontró ningún hospital con el id: " + id }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospital
        });

    })

});

module.exports = app;
