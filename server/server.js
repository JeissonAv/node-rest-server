require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB,
    { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log('Database connected');
    });


app.listen(process.env.PORT, () => console.log(`Escuchando peticiones en puerto ${process.env.PORT}`));
