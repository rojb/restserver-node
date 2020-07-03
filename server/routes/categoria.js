const express = require('express');
let route = express.Router();
const _ = require('underscore');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');




// ============================
// Mostrar todas las categorías
// ============================
route.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, total) => {
                res.json({
                    ok: true,
                    categorias,
                    total
                });
            });
        });
});

// ============================
// Mostrar una categoría por ID
// ============================
route.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe la categoría'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// ============================
// Crear una nueva categoría
// ============================
route.post('/categoria', verificaToken, (req, res) => {
    let body = req.body
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err
            });

        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

route.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err
            });

        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ============================
// Borrar una categoría
// ============================
route.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });

        }
        res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: 'Se eliminó exitosamente'
        })
    });
});
module.exports = route;