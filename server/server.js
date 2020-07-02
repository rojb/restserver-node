const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('./config/config');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// Habilitar la carpeta public para que pueda ser accedida

app.use(express.static(path.resolve(__dirname, '../public')));
// Importa la rutas de nuestra aplicación
app.use(require('./routes/index'));

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