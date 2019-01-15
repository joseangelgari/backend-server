var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

// =======================
// VERIFY TOKEN
// =======================
exports.verifyToken = function(req, res, next){
    
    var token = req.query.token;
  
    jwt.verify( token, SEED, (err, decoded) => {
  
      if(err){
        return res.status(401).json({
          ok: false,
          mensaje: "Token incorrecto",
          errors: err
        });
      }

      req.usuario = decoded.usuario;
  
      next();
  
    });
}

// =======================
// VERIFY ADMIN
// =======================
exports.verifyADMIN_ROLE = function(req, res, next){

    var role = req.usuario.role;

    if(role === 'ADMIN_ROLE'){
      next();
      return;
    }else{
      return res.status(401).json({
        ok: false,
        mensaje: "Token incorrecto - No permisos administrador",
        errors: {mensaje: 'No tiene permiso para realizar esta acción'}
      });
    }
}

// =======================
// VERIFY ADMIN o mismoUsuario
// =======================
exports.verifyADMIN_ROLE_mismoUsuario = function(req, res, next){

    var role = req.usuario.role;
    var id = req.params.id;

    if(role === 'ADMIN_ROLE' || req.usuario._id === id){
      next();
      return;
    }else{
      return res.status(401).json({
        ok: false,
        mensaje: "Token incorrecto - No permisos administrador",
        errors: {mensaje: 'No tiene permiso para realizar esta acción'}
      });
    }
}