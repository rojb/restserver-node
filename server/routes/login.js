const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');


app.post('/login', (req, res) => {
    let body = req.body;



    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: '(Usuario) o contraseña incorrecto'
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario o (contraseña) incorrecto'
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });


});

module.exports = app;