require('./config/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

//Para formato aplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}))
//Para formato application/json
app.use(bodyParser.json())


app.get('/usuarios', (req, res) => {

    res.json({message:'Get usuario'})
});

app.post('/usuarios', (req, res) => {

    let body = req.body

    if(body.nombre === undefined){
        res.status(400).json({
            ok:false,
            mensaje: 'El nombre es necesario'
        })

    }else{
    let body = req.body
    res.json({
        usuario:body
    })
    }

});

app.put('/usuarios/:id', (req, res) => {

    let id = req.params.id;

    res.json({
        id
    })
});

app.delete('/usuarios', (req, res) => {
    res.json('delete Usuarios')
});

app.listen(process.env.PORT, () => console.log(`Escuachando en el puerto ${process.env.PORT}`))

