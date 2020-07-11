const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');

const route = express.Router();

route.get('/imagenes/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let noImgPath = path.resolve(__dirname, '../assets/no-image.jpg');
    let imgPath = path.resolve(__dirname, `../../uploads/${tipo}s/${img}`);
    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        res.sendFile(noImgPath);
    }


});

module.exports = route;