const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbManager = require('../Controladores/SchemaBuilder');

dbManager.initialize(); // Crea tablas y datos iniciales

const db = dbManager.getInstance(); // Si necesitas ejecutar queries manuales