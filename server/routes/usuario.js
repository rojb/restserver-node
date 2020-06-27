const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre role email estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.countDocuments({ estado: true }, (err, contador) => {

                    res.json({
                        ok: true,
                        usuarios,
                        total: contador
                    });

                });

            }

        );
});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


});
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let estado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, estado, { new: true }, (err, usuarioBorradoDB) => {
        if (err) {
            return res.status(400).json({
                ok: true,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorradoDB
        });
    });
});

module.exports = app;