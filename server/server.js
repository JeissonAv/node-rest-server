require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json('Hello World')
});

app.post('/usuario', (req, res) => {
    let body = req.body;
    if (body.id === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    } else {
        res.json({
            body
        });
    }
});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;

    res.json({
        id
    });
});

app.listen(process.env.PORT, () => console.log(`Escuchando peticiones en puerto ${process.env.PORT}`));