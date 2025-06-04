const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const app = express();

require('dotenv').config();

// Ahora puedes acceder a las variables de entorno así:
const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;
const DB_PATH = process.env.DB_PATH;
const SESSION_DB_PATH = process.env.SESSION_DB_PATH;
const NODE_ENV = process.env.NODE_ENV;

console.log(`Variables de entorno`, `PORT`, PORT);
console.log(`Variables de entorno`, `SESSION_SECRET`, SESSION_SECRET);
console.log(`Variables de entorno`, `DB_PATH`, DB_PATH);
console.log(`Variables de entorno`, `SESSION_DB_PATH`, SESSION_DB_PATH);

// Middleware de seguridad y optimización
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Configuración de sesiones
app.use(session({
    store: new SQLiteStore({ db: SESSION_DB_PATH }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

app.use(compression());
// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos con cache
app.use(express.static(path.join(__dirname, '/public'), {
    maxAge: NODE_ENV === 'production' ? '1y' : '0',
    etag: true,
    lastModified: true
}));

// Configurar motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/public"));

// Importar rutas
const indexRoutes = require('./server/rutas/index');
// const userRoutes = require('./routes/users');

// Usar rutas
app.use('/', indexRoutes);
// app.use('/users', userRoutes);

const db = require('./server/config/database');

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;