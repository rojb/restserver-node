const express = require('express');
const fileUpload = require('express-fileupload');
const route = express.Router();
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
// default options
route.use(fileUpload());


route.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //Validar tipo
    let tiposValidos = ['producto', 'usuario'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son ${tiposValidos.join(', ')}`
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension;
    try {
        extension = nombreCortado[nombreCortado.length - 1];
    } catch (error) {
        extension = 'no-extension';
    }


    let extesionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extesionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: `Extensión no soportada, las extensiones soportadas son ${extesionesValidas.join(', ')}`,
            ext: extension
        });
    }

    // Cambiar nombre del archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}s/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // Aquí se ha subido ya la imagen
        if (tipo === 'usuario') {
            imgUsuario(nombreArchivo, res, id);
        } else {
            imgProducto(nombreArchivo, res, id);
        }


    });
});

function imgUsuario(nombreArchivo, res, id) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuario');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuario');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existente'
                }
            });
        }

        // Borrando la imagen previamente subida

        borrarArchivo(usuarioDB.img, 'usuario');

        // Asignando el nombre del archivo que acabamos de subir al campo img
        // de nuestro modelo

        usuarioDB.img = nombreArchivo;

        // Guardando nuestro usuario modificado en la base de datos
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                message: 'Imagen subida correctamente',
                usuario: usuarioGuardado
            });
        });
    });

}

function imgProducto(nombreArchivo, res, id) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'producto');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'producto');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, 'producto');
        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });

    });
}

function borrarArchivo(nombreArchivo, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}s/${nombreArchivo}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}
module.exports = route;