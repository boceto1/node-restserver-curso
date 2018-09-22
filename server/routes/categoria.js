const express = require('express');
const _ = require('underscore');
 
const {verificaToken,verificarAdmin_Role} = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria')


/**
 * Mostrar todas las categorias
 */
app.get('/categoria',verificaToken ,(req,res)=>{

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec((err,categoriasDB) =>{

            if(err){
                return res.status(400).json({
                     ok:false,
                     err
                 });  
             }

            res.json({
                ok:true,
                count:categoriasDB.length,
                categorias:categoriasDB
            })
        })

});

/**
 * Mostrar una categoria por ID
 */
app.get('/categoria/:id',verificaToken , (req,res)=>{

    let id = req.params.id;

    Categoria.findById(id,(err,categoriaDB)=>{

        if(err){
            return res.status(400).json({
                 ok:false,
                 err
             });  
         }

         res.json({
            ok:true,
            categoria:categoriaDB
        })
         
    })

});


/**
 * Mostrar todas las categorias
 */
app.post('/categoria',verificaToken,(req,res)=>{

    let body = req.body
    
    let categoria = new Categoria({
        descripcion:body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err,categoriaDB)=>{

        if(err){
           return res.status(400).json({
                ok:false,
                err
            });  
        }

        res.status(201).json({
            ok:true,
            categoria:categoriaDB
        })

    });





});

/**
 * Actualizar la categoría
 */
app.put('/categoria/:id', verificaToken,(req,res)=>{
    
    let id = req.params.id;
    let body = _.pick(req.body,['descripcion']);

   
    Categoria.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,categoriaDB)=>{

        if(err){
            return res.status(400).json({
                 ok:false,
                 err
             });  
         }
 
         if(!categoriaDB){
            return res.status(404).json({
                ok:false,
                err: {message:'El categoria no existe'}
            });  
         }

        
         res.json({
            ok:true,
            categoria: categoriaDB
        })  

    })


});


/**
 * Borrar la categoria
 */
app.delete('/categoria/:id',[verificaToken,verificarAdmin_Role], (req,res)=>{

    let id = req.params.id;
    
    Categoria.findByIdAndRemove(id,(err,categoriaBorrado)=>{
        
        if(err){
            return res.status(400).json({
                 ok:false,
                 err
             });  
         }

         if(!categoriaBorrado){
            return res.status(404).json({
                ok:false,
                err: {message:'El usuario no existe'}
            });  
         }

         res.json({
             ok:true,
             categoria:categoriaBorrado
         });
    });

});


module.exports = app;
