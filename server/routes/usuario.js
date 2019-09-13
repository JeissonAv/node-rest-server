const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/authentication');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.to || 5;
    limit = Number(limit);

    Usuario.find({ estado: true }, 'nombre email roel estado google img')
        .skip(from)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, count) => {
                res.json({
                    ok: true,
                    cantidad: count,
                    usuarios
                });
            })

        });
});

app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
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

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
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

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    // Borrado en la base de datos
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;