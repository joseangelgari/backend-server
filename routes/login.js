var express = require("express");
var Usuario = require("../models/usuario");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;
var GOOGLE_ID = require("../config/config").GOOGLE_ID;
var GOOGLE_SECRET = require("../config/config").GOOGLE_SECRET;
var mdAuth = require("../middlewares/mdAuth");

var {OAuth2Client} = require('google-auth-library');

var app = express();

// =======================
// Login Google
// =======================
app.get('/renovate-token', mdAuth.verifyToken, (req, res) =>{

	var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 }) //4 horas

	return res.status(200).json({
		ok: true,
		token: token
	});
})


// =======================
// Login Google
// =======================
app.post('/google', (req, res)=>{

	var token = req.body.token || 'XXX';

	var client = new OAuth2Client(GOOGLE_ID, GOOGLE_SECRET);

	async function verify() {
		const ticket = await client.verifyIdToken({
				idToken: token,
				audience: GOOGLE_ID,  // Specify the CLIENT_ID of the app that accesses the backend
				// Or, if multiple clients access the backend:
				//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
		});
		const payload = ticket.getPayload();
		// If request specified a G Suite domain:
		//const domain = payload['hd'];

		Usuario.findOne({ email: payload.email }, (err, usuario) => {

			if(err){
				return res.status(500).json({
					ok: false,
					mensaje: "Error encontrando usuario", 
					errors: err
				});
			}

			if( usuario ){

				if( usuario.google === false ){

					return res.status(400).json({
						ok: false,
						mensaje: "Debe usar su autenticación normal (email-password)", 
					});

				}else{

					// Crear Token
					usuario.password = ':)';
					var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 }) //4 horas

					return res.status(200).json({
						ok: true,
						mensaje: 'Login Google success',
						usuario: usuario,
						token: token,
						id: usuario._id,
						menu: getMenu(usuario.role)
					});

				}

			}else{

				var usuario = new Usuario();

				usuario.name = payload.name;
				usuario.email = payload.email;
				usuario.img = payload.picture;
				usuario.password = ':)';
				usuario.google = true;

				usuario.save((err, usuarioDB)=>{

					if(err){
						return res.status(500).json({
							ok: false,
							mensaje: "Error creando usuario - google", 
							errors: err
						});
					}

					// Crear Token
					var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }) //4 horas

					res.status(200).json({
						ok: true,
						mensaje: 'Login Google success',
						usuario: usuarioDB,
						token: token,
						id: usuarioDB._id,
						menu: getMenu(usuarioDB.role)
					});

				});
			}

		});
	}

	verify().catch( error => {
		res.status(400).json({
			ok: false,
			message: 'Token invalid',
			errors: error
		});
	});
});

// =======================
// Login Normal
// =======================
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

		res.status(200).json({
			ok: true,
			mensaje: 'Login post success',
			usuario: usuarioDB,
			token: token,
			id: usuarioDB._id,
			menu: getMenu(usuarioDB.role)
		});

	});

});

function getMenu(ROLE){

	var menu = [
    {
      title: 'Principal',
      icon: 'icon-speedometer menu-icon',
      submenu: [
        {title: 'Dashboard', url: '/dashboard'},
        {title: 'Progress Bar', url: '/progress'},
        {title: 'Graphics', url: '/graphic1'},
        {title: 'Promises', url: '/promises'},
        {title: 'Rxjs', url: '/rxjs'}
      ]
    },
    {
      title: 'Maintenance',
      icon: 'mdi mdi-lock',
      submenu: [
        // {title: 'Usuarios', url: '/usuarios'},
        {title: 'Hospitales', url: '/hospitales'},
        {title: 'Médicos', url: '/medicos'}
      ]
    }
	]

	if(ROLE === 'ADMIN_ROLE'){
		menu[1].submenu.unshift({title: 'Usuarios', url: '/usuarios'});
	}
	
	return menu;
}

module.exports = app;