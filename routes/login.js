var express = require("express");
var Usuario = require("../models/usuario");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

var app = express();

app.post('/', (req, res) => {

	var body = req.body;

	Usuario.findOne({ email: body.email}, (err, usuarioDB) => {

		if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error encontrando usuario", 
        errors: err
      });
		}
		
		if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas", 
        errors: {message: 'error email'}
      });
		}
		
		if ( !bcrypt.compareSync(body.password, usuarioDB.password) ) {
      return res.status(400).json({
        ok: false,
        mensaje: "Credenciales incorrectas", 
        errors: {message: 'error password'}
      });
		}

		
		// Crear Token
		usuarioDB.password = ':)';
		var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) //4 horas

		res.status(500).json({
			ok: true,
			mensaje: 'Login post success',
			usuario: usuarioDB,
			token: token,
			id: usuarioDB._id
		});

	});

});

module.exports = app;