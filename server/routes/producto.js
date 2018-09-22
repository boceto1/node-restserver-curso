const express = require('express');
const _ = require('underscore');

const {verificaToken,verificarAdmin_Role} = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


/**
 * Obtener productos
 */
app.get('/productos',verificaToken,(req,res)=>{
  
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;


    Producto.find({disponible:true})
            .sort('nombre')
            .populate('usuario','nombre email')
            .populate('categoria','descripcion')
            .skip(desde) //Para que que los registros se envien de 5 en 5
            .limit(limite)//Para solo enviar 5 usuarios
            .exec((err,productos)=>{ //ejecutar función con resultados
                
                if(err){
                    return res.status(400).json({
                         ok:false,
                         err
                     });  
                 }
                                  
                   res.json({
                        ok:true,
                        count:productos.length,
                        productos
                    }) 
 
            })

});

/**
 * Obtener producto por ID
 */
app.get('/productos/:id',verificaToken,(req,res)=>{

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario','nombre email')
        .populate('categoria','descripcion')
        .exec((err,productoDB)=>{

        if(err){
            return res.status(500).json({
                 ok:false,
                 err
             });  
         }

         if(!productoDB){
            return res.status(404).json({
                ok:false,
                err: {message:'El producto no existe'}
            });  
         }

         res.json({
            ok:true,
            producto:productoDB
        })
         
    })

});

/**
 *  Buscar producto
 */

 app.get('/productos/buscar/:termino',verificaToken,(req,res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino,'i')

    Producto.find({nombre:regex})
        .populate('categoria','nombre')
        .exec((err,productos)=>{

            if(err){
                return res.status(500).json({
                     ok:false,
                     err
                 });  
             }

             res.json({
                 ok:true,
                 productos
             })


        })

 })

/**
 * Crear un producto
 */
app.post('/productos',verificaToken,(req,res)=>{

    let body = req.body;

    let producto = new Producto({
        nombre:body.nombre,
        precioUni:body.precioUni,
        descripcion:body.descripcion,
        categoria:body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err,productoDB)=>{

        if(err){
           return res.status(500).json({
                ok:false,
                err
            });  
        }

        res.status(201).json({
            ok:true,
            producto:productoDB
        })

    });




});

/**
 * Actualizar un producto por ID
 */
app.put('/productos/:id',verificaToken,(req,res)=>{

    let id = req.params.id;
    let body = _.pick(req.body,['nombre', 'precioUni', 'descripcion' , 'disponible']);

    Producto.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,productoDB)=>{

        if(err){
            return res.status(400).json({
                 ok:false,
                 err
             });  
         }
 
         if(!productoDB){
            return res.status(404).json({
                ok:false,
                err: {message:'El producto no existe'}
            });  
         }

        
         res.json({
            ok:true,
            producto: productoDB
        })  

    })

});

/**
 * Borrar un producto por ID
 */
app.delete('/productos/:id',[verificaToken,verificarAdmin_Role],(req,res)=>{
    
    let id = req.params.id;
    
    body={
        disponible:false
    }

    Producto.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,productoDB)=>{

        if(err){
            return res.status(400).json({
                 ok:false,
                 err
             });  
         }
 
         if(!productoDB){
            return res.status(404).json({
                ok:false,
                err: {message:'El producto no existe'}
            });  
         }

        
         res.json({
            ok:true,
            producto: productoDB
        })  

    })

});

module.exports = app;