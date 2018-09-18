const jwt = require('jsonwebtoken')


/**
 * Verificar Token
 */

 let verificaToken = (req,res,next) =>{

    // req.get () devuleve HEADERS
    let token = req.get('Authorization');

    jwt.verify(token,process.env.SEMILLA, (err,decoded)=>{

        if(err){
            return res.status(401).json({
                ok:false,
                err
            })
        }

        //Para despues manejar un usuario ya validado
        req.usuario = decoded.usuario;
        next();

    });
 }

 /**
  * Verificar Admin_Role
  */

  let verificarAdmin_Role = (req,res,next)=>{

    let usuario = req.usuario;
    
    if(usuario.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok:false,
            err:{
                message:'Usuario no autorizado'
            }
        })
    }

    next()



  }


 module.exports={
     verificaToken,
     verificarAdmin_Role
 }