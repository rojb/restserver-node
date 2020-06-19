const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.get('/usuario', function(req, res) {
    res.json('get Usuario');
})
app.put('/usuario/:id', function(req, res) {
    let parametro = req.params.id;
    res.json({
        id: parametro
    });
})
app.post('/usuario', function(req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            message: 'El nombre es necesario'
        });
    } else {

        res.json({
            persona: body
        });
    }
})
app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto `, process.env.PORT);
})