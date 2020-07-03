const express = require('express');
let Producto = require('../models/producto');
const _ = require('underscore');



const { verificaToken } = require('../middlewares/autenticacion');
let route = express.Router();



// ========================
// Crear un nuevo producto
// ========================
route.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let usuario = req.usuario._id;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// =======================================
// Obtener todos los productos - paginado
// =======================================
route.get('/producto', verificaToken, (req, res) => {
    let desde = req.body.desde || 0;
    let limite = req.body.limite || 5;
    desde = Number(desde);
    limite = Number(limite);
    Producto.find({ disponible: true })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, total) => {
                res.json({
                    ok: true,
                    productos,
                    total
                });
            });

        });
});

// =============================
// Obtener un producto por ID
// =============================
route.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no se encontró'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

// =============================
// Buscar un producto
// =============================
route.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos: productoDB
        });
    });
});

// =============================
// Actualizar un producto por ID
// =============================
route.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'disponible', 'precioUni', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no se encontró'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ===================================================
// Cambia la disponibilidad de un producto dado un id
// ===================================================
route.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se pudo eliminar el producto'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB,
            message: 'El producto fue eliminado'
        });
    });
});
module.exports = route;