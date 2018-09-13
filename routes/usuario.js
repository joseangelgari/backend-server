var express = require("express");
var Usuario = require("../models/usuario");
var bcrypt = require("bcryptjs");

var app = express();

// =======================
// GET USER
// =======================
app.get("/", (req, res, next) => {
  Usuario.find({}, "name email img role").exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando usuarios",
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      usuarios: usuarios
    });
  });
});

// =======================
// POST USER
// =======================
app.post("/", (req, res) => {
  var body = req.body;

  var usuario = new Usuario({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save((err, usuarioSaved) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardando usuario",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      usuarioSaved: usuarioSaved
    });
  });
});

// =======================
// PUT USER
// =======================
app.put('/:id', (req, res)=> {

	var id = req.params.id;
  var body = req.body;

	Usuario.findById( id, (err, usuario)=>{

		if(err){
			return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err
      }); 
		}

		if(!usuario){
			return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el id: " + id + " no existe",
        errors: {message: 'No se encontró usuario con ese id'}
      }); 
		}

		usuario.name = body.name
		usuario.email = body.email
		usuario.role = body.role

		usuario.save((err, usuarioSaved)=>{

			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: "Error actualizando usuario",
					errors: err
				});
			}

			usuario.password = '¿qué dijiste, navidad?'

			res.status(200).json({
				ok: true,
				usuarioSaved: usuarioSaved
			});

		});

	});

	// res.status(201).json({
	// 	ok: true,
	// 	id: id
	// });

});


module.exports = app;
