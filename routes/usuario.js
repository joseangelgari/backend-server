var express = require("express");
var Usuario = require("../models/usuario");
var bcrypt = require("bcryptjs");
var mdAuth = require("../middlewares/mdAuth");
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
app.post("/", mdAuth.verifyToken, (req, res) => {
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

    usuarioSaved.password = ':)';

    res.status(201).json({
      ok: true,
      usuario: usuarioSaved
    });
  });
});

// =======================
// PUT USER
// =======================
app.put('/:id', mdAuth.verifyToken, (req, res)=> {

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

		usuario.name = body.name;
		usuario.email = body.email;
		usuario.role = body.role;

		usuario.save((err, usuarioUpdated)=>{

			if (err) {
				return res.status(400).json({
					ok: false,
					mensaje: "Error actualizando usuario",
					errors: err
				});
			}

			usuarioUpdated.password = ':)';

			res.status(200).json({
				ok: true,
				usuario: usuarioUpdated
			});

		});

	});

});

// =======================
// DELETE USER BY ID
// =======================
app.delete('/:id', mdAuth.verifyToken, (req, res) => {

  var id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, usuarioDeleted) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error eliminando usuario",
        errors: err
      });
    }

    if(!usuarioDeleted){
      return res.status(400).json({
        ok: false,
        mensaje: "No existe usuario con ese id",
        errors: {message: 'No existe usuario con ese id '}
      });
    }else{
      usuarioDeleted.password = ':)'
    }

    res.status(200).json({
      ok: true,
      usuario: usuarioDeleted
    });
  })

})

module.exports = app;
