const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const maestras = [
    `CREATE TABLE IF NOT EXISTS tEstados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100) NOT NULL UNIQUE 
    );`,
    `CREATE TABLE IF NOT EXISTS tTiposEventos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100) NOT NULL UNIQUE
    );`,
    `CREATE TABLE IF NOT EXISTS tRoles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(50) NOT NULL UNIQUE
    );`,
    `CREATE TABLE IF NOT EXISTS tCiudades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100) NOT NULL,
        departamento VARCHAR(100),
        pais VARCHAR(100) DEFAULT 'Colombia'
    );`,
    `CREATE TABLE IF NOT EXISTS tCategoriasEventos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(100) NOT NULL UNIQUE,
        descripcion TEXT,
        icono VARCHAR(255),
        activo BOOLEAN DEFAULT TRUE
    );`
];

const pivotes = [        
    `CREATE TABLE IF NOT EXISTS tTiposUbicaciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fkLugarEvento INTEGER NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        FOREIGN KEY (fkLugarEvento) REFERENCES tEventos(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE IF NOT EXISTS tDisponibilidad (
        fkEvento INTEGER NOT NULL,
        fkTipoUbicacion INTEGER NOT NULL,
        cantidad INTEGER NOT NULL DEFAULT 0 CHECK (cantidad >= 0),
        precioPublico DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (precioPublico >= 0),
        precioNeto DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (precioNeto >= 0),
        descuento DECIMAL(5,2) DEFAULT 0.00 CHECK (descuento >= 0 AND descuento <= 100),
        fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (fkEvento, fkTipoUbicacion),
        FOREIGN KEY (fkEvento) REFERENCES tEventos(id) ON DELETE CASCADE,
        FOREIGN KEY (fkTipoUbicacion) REFERENCES tTiposUbicaciones(id) ON DELETE CASCADE
    );`
]

const principales = [
    `CREATE TABLE IF NOT EXISTS tLugaresEventos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(200) NOT NULL,
        imagenLocal VARCHAR(500),
        imagenLugar VARCHAR(500),
        fkCiudad INTEGER,
        direccion VARCHAR(300),
        capacidadMaxima INTEGER CHECK (capacidadMaxima > 0),
        telefono VARCHAR(20),
        email VARCHAR(100),
        sitioWeb VARCHAR(255),
        activo BOOLEAN DEFAULT TRUE,
        fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (fkCiudad) REFERENCES tCiudades(id)
    );`,
    `CREATE TABLE IF NOT EXISTS tEventos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre VARCHAR(200) NOT NULL,
        fechaInicio DATE NOT NULL,
        horaInicio TIME,
        fechaFin DATE,
        horaFin TIME,
        ubicacion VARCHAR(300),
        descripcion TEXT,
        fkEstado INTEGER NOT NULL DEFAULT 1,
        fkTipoEvento INTEGER NOT NULL,
        fkCategoriaEvento INTEGER,
        imagenPromocional VARCHAR(500),
        fkCiudad INTEGER,
        fkLugarEvento INTEGER,
        direccion VARCHAR(300),
        conDescuento REAL DEFAULT 0.0 CHECK (conDescuento >= 0 AND conDescuento <= 100),
        fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        fechaModificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (fkEstado) REFERENCES tEstados(id),
        FOREIGN KEY (fkTipoEvento) REFERENCES tTiposEventos(id),
        FOREIGN KEY (fkCategoriaEvento) REFERENCES tCategoriasEventos(id),
        FOREIGN KEY (fkCiudad) REFERENCES tCiudades(id),
        FOREIGN KEY (fkLugarEvento) REFERENCES tLugaresEventos(id)
    );`,
    `CREATE TABLE IF NOT EXISTS tUsuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        clave VARCHAR(255) NOT NULL,
        nombre VARCHAR(100),
        apellido VARCHAR(100),
        telefono VARCHAR(20),
        fechaNacimiento DATE,
        avatar VARCHAR(500),
        ultimoIngreso DATETIME,
        fkRole INTEGER NOT NULL DEFAULT 2,
        fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
        activo BOOLEAN DEFAULT TRUE,
        emailVerificado BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (fkRole) REFERENCES tRoles(id)
    );`,
    `CREATE TABLE IF NOT EXISTS tReservas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fkUsuario INTEGER NOT NULL,
        fkEvento INTEGER NOT NULL,
        fkTipoUbicacion INTEGER NOT NULL,
        cantidadBoletos INTEGER NOT NULL CHECK (cantidadBoletos > 0),
        precioUnitario DECIMAL(10,2) NOT NULL,
        precioTotal DECIMAL(10,2) NOT NULL,
        descuentoAplicado DECIMAL(5,2) DEFAULT 0.00,
        codigoReserva VARCHAR(20) UNIQUE NOT NULL,
        estadoReserva VARCHAR(20) DEFAULT 'Pendiente' CHECK (estadoReserva IN ('Pendiente', 'Confirmada', 'Pagada', 'Cancelada', 'Utilizada')),
        metodoPago VARCHAR(50),
        fechaReserva DATETIME DEFAULT CURRENT_TIMESTAMP,
        fechaVencimiento DATETIME,
        fechaPago DATETIME,
        notas TEXT,
        FOREIGN KEY (fkUsuario) REFERENCES tUsuarios(id),
        FOREIGN KEY (fkEvento) REFERENCES tEventos(id),
        FOREIGN KEY (fkTipoUbicacion) REFERENCES tTiposUbicaciones(id)
    );`
]

const disparadores = [
    `CREATE TRIGGER IF NOT EXISTS update_evento_timestamp AFTER UPDATE ON tEventos
    FOR EACH ROW
    BEGIN
        UPDATE tEventos SET fechaModificacion = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;`
];

const statements = maestras.concat(pivotes, principales, disparadores);

class SchemaBuilder {
    constructor(db, statements) {
        this.db = db;
        this.tablas = statements;
    }
    
    crearTablas() {
        this.db.serialize(() => {
            this.tablas.forEach(sql => {
                this.db.run(sql, err => {
                    if (err) console.error('Error ejecutando SQL:', err.message);
                });
            });
        });
    }

    insertInitialData() {
        this.db.serialize(() => {
            this.db.run(`INSERT OR IGNORE INTO tEstados (nombre) VALUES 
                ('Activo'), ('Inactivo'), ('Pendiente'), ('Cancelado'), ('Finalizado')`);

            this.db.run(`INSERT OR IGNORE INTO tRoles (nombre) VALUES 
                ('Administrador'), ('Usuario'), ('Organizador'), ('Moderador')`);

            this.db.run(`INSERT OR IGNORE INTO tTiposEventos (nombre) VALUES 
                ('Concierto'), ('Conferencia'), ('Taller'), ('Deportivo'), ('Cultural'), ('Gastronómico')`);

            this.db.run(`INSERT OR IGNORE INTO tCategoriasEventos (nombre, descripcion) VALUES 
                ('Música', 'Eventos relacionados con música y conciertos'),
                ('Educación', 'Conferencias, talleres y eventos educativos'),
                ('Deportes', 'Eventos deportivos y competencias'),
                ('Arte y Cultura', 'Exposiciones, teatro y eventos culturales'),
                ('Gastronomía', 'Eventos gastronómicos y culinarios'),
                ('Tecnología', 'Eventos de tecnología e innovación'),
                ('Negocios', 'Networking y eventos empresariales')`);
        });
    }

    apply() {
        this.crearTablas();
        this.insertInitialData();
    }
}

class DatabaseManager {
    constructor() {
        // Set default database path if DB_PATH is not defined
        this.dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'events.db');
        
        // Ensure the database directory exists
        const dbDir = path.dirname(this.dbPath);
        const fs = require('fs');
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }
        
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Error al conectar con la base de datos:', err.message);
            } else {
                console.log(`Base de datos conectada en: ${this.dbPath}`);
            }
        });

        this.schemaBuilder = new SchemaBuilder(this.db, statements);
    }

    initialize() {
        this.schemaBuilder.apply();
    }

    getInstance() {
        return this.db;
    }
}

// Exportar instancia
module.exports = new DatabaseManager();