require('./config/config')

const express = require('express')
const mongoose = require('mongoose')

const app = express()
const bodyParser = require('body-parser')

//Para formato aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}))
//Para formato application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'))

mongoose.connect(process.env.URLDB, (err,res)=>{

    if(err) throw err;

    console.log('Base de datos ONLINE');

});

app.listen(process.env.PORT, () => console.log(`Escuachando en el puerto ${process.env.PORT}`))

