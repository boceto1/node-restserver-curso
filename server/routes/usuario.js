const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuarios')

const app = express()

app.get('/usuarios', (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;


    Usuario.find({estado:true},'nombre email role estado google')
            .skip(desde) //Para que que los registros se envien de 5 en 5
            .limit(limite)//Para solo enviar 5 usuarios
            .exec((err,usuarios)=>{ //ejecutar función con resultados
                
                if(err){
                    return res.status(400).json({
                         ok:false,
                         err
                     });  
                 }
                 

                 Usuario.count({estado:true},(err,count)=>{
                    res.json({
                        ok:true,
                        count,
                        usuarios
                    }) 
                 })
 

            })
    
});

app.post('/usuarios', (req, res) => {

    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });

    usuario.save((err,usuarioDB)=>{

        if(err){
           return res.status(400).json({
                ok:false,
                err
            });  
        }

        res.status(201).json({
            ok:true,
            usuario:usuarioDB
        })

    });

});

app.put('/usuarios/:id', (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body,['nombre','email','img','role','estado']);

   
    Usuario.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,usuarioDB)=>{

        if(err){
            return res.status(400).json({
                 ok:false,
                 err
             });  
         }
 
         if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                err: {message:'El usuario no existe'}
            });  
         }

        
         res.json({
            ok:true,
            usuario: usuarioDB
        })  

    })
});

// Borrado lógico (Cambio de estado)
app.delete('/usuarios/:id', (req, res) => {
   
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id,{estado:false},{new:true,runValidators:true},(err,usuarioBorrado)=>{
        
        if(err){
            return res.status(400).json({
                 ok:false,
                 err
             });  
         }

         if(!usuarioBorrado){
            return res.status(404).json({
                ok:false,
                err: {message:'El usuario no existe'}
            });  
         }

         res.json({
             ok:true,
             usuario:usuarioBorrado
         });
    });
});





// Borrado físico

/* app.delete('/usuarios/:id', (req, res) => {
   
    let id = req.params.id;
    console.log(id);

    Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
        
        if(err){
            return res.status(400).json({
                 ok:false,
                 err
             });  
         }

         if(!usuarioBorrado){
            return res.status(404).json({
                ok:false,
                err: {message:'El usuario no existe'}
            });  
         }

         res.json({
             ok:true,
             usuario:usuarioBorrado
         });
    });
}); */

module.exports = app