// server/app.js
const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const PORT = process.env.PORT || 3000;

const app = express();

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

app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite por IP
});
app.use('/api', limiter);

// Configuración de sesiones
app.use(session({
    store: new SQLiteStore({ db: process.env.SESSION_DB_PATH }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos con cache
app.use(express.static(path.join(__dirname, '/public'), {
    maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
    etag: true,
    lastModified: true
}));

// Configurar motor de plantillas (si usas EJS o similar)
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + "/public"));

// Middleware para inyectar variables globales en templates
// app.use((req, res, next) => {
//     res.locals.user = req.session.user;
//     res.locals.isAdmin = req.session.user?.role === 'admin';
//     res.locals.csrfToken = req.csrfToken?.() || null;
//     next();
// });

// Importar rutas
const indexRoutes = require('./server/rutas/index');
// const userRoutes = require('./routes/users');

// Usar rutas
app.use('/', indexRoutes);
// app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const db = require('./server/config/database');

module.exports = app;