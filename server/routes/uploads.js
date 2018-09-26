const express = require('express');
const fileUpload = require('express-fileupload');

const fs = require('fs');
const path = require('path');

const app = express();

const Usuario = require('../models/usuarios');
const Producto = require('../models/producto');

// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha selecionado ningún archivo'
            }
        });
    }


    //Validar tipo
    let tiposValidos = ['producto', 'usuario'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son ${tiposValidos.join(', ')}`
            }
        })
    }


    //Extensiones Permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    let archivo = req.files.archivo;
    let [nombreArchivo, extension] = archivo.name.split('.');

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son ${extensionesValidas.join(', ')}`
            }
        })
    }

    // Cambiar el nombre al archivo
    nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(tipo==='usuario')
            return imagenUsuario(id,res,nombreArchivo);
        
        if(tipo==='producto')
            return imagenProducto(id,res,nombreArchivo);

    });

});


function imagenUsuario(id, res,nombreArchivo) {

    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borrarArchivo(nombreArchivo,'usuario')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioBD){
            borrarArchivo(nombreArchivo,'usuario')
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioBD.img,'usuario')


        usuarioBD.img = nombreArchivo;

        usuarioBD.save((err,usuarioGuardado)=>{
            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });
}

function imagenProducto(id, res,nombreArchivo) {

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            borrarArchivo(nombreArchivo,'producto')
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoBD){
            borrarArchivo(nombreArchivo,'producto')
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Producto no existe no existe'
                }
            });
        }

        borrarArchivo(productoBD.img,'producto')


        productoBD.img = nombreArchivo;

        productoBD.save((err,usuarioGuardado)=>{
            res.json({
                ok:true,
                producto: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });

}

function borrarArchivo (nombreImagen,tipo){
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreImagen}`); 
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen)
    }
}

module.exports = app;