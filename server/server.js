const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./config/config');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Importa la rutas del usuario
app.use(require('./routes/usuario.js'));

mongoose.set('useCreateIndex', true);


mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .catch((err) => console.log(err));

mongoose.connection.on('open', _ => {
    console.log('Base de datos ONLINE');
});
app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto `, process.env.PORT);
});