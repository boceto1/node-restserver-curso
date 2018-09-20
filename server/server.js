require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()


//Para formato aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}))
//Para formato application/json
app.use(bodyParser.json())
//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname,'../public')))

// Configuracion global de rutas
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, (err,res)=>{

    if(err) throw err;

    console.log('Base de datos ONLINE');

});

app.listen(process.env.PORT, () => console.log(`Escuachando en el puerto ${process.env.PORT}`))

