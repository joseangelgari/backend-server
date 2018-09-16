var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

// =======================
// VERIFY TOKEN
// =======================
exports.verifyToken = function(req, res, next){
    
    var token = req.query.token;
  
    jwt.verify( token, SEED, (err, decode) => {
  
      if(err){
        return res.status(401).json({
          ok: false,
          mensaje: "Token incorrecto",
          errors: err
        });
      }
  
      next();
  
    });
}