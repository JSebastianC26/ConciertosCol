const path = require('path');
const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT;

// Configurar motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/public"));

const indexRoutes = require('./server/rutas/index.js');

app.use('/', indexRoutes);

app.use('/admin', indexRoutes);

app.use('/login', indexRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;