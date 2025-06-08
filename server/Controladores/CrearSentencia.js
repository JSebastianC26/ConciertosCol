/**
 * Creacion de sentencias basicas de base de datos.
 */
class CrearSentencia {
    constructor(tableName) {
        this.tableName = tableName;
    }

    // CREATE - Insertar registros
    async create({registros}) {
        if (!registros || registros.length === 0) return '';
        
        // Normalizar a array si es un objeto único
        const registrosArray = Array.isArray(registros) ? registros : [registros];
        
        // Obtener columnas del primer registro
        const columnas = Object.keys(registrosArray[0]);
        const columnasStr = columnas.join(', ');
        
        // Crear VALUES para cada registro
        const valoresArray = registrosArray.map(registro => {
            const valores = columnas.map(col => {
                const valor = registro[col];
                return this.formatearValor(valor);
            });
            return `(${valores.join(', ')})`;
        });
        
        return `INSERT INTO ${this.tableName} (${columnasStr}) VALUES ${valoresArray.join(', ')};`;
    }

    // READ - Seleccionar registros
    async read({columnas = '*', condiciones = null, orderBy = null, limit = null}) {
        let query = `SELECT ${Array.isArray(columnas) ? columnas.join(', ') : columnas} FROM ${this.tableName}`;
        
        // Agregar condiciones WHERE
        if (condiciones) {
            query += ` WHERE ${this.construirCondiciones(condiciones)}`;
        }
        
        // Agregar ORDER BY
        if (orderBy) {
            query += ` ORDER BY ${orderBy}`;
        }
        
        // Agregar LIMIT
        if (limit) {
            query += ` LIMIT ${limit}`;
        }
        
        return query + ';';
    }

    // UPDATE - Actualizar registros
    async update({datosActualizacion, condiciones}) {
        if (!datosActualizacion || Object.keys(datosActualizacion).length === 0) {
            throw new Error('Se requieren datos para actualizar');
        }
        
        if (!condiciones) {
            throw new Error('Se requieren condiciones WHERE para actualizar (por seguridad)');
        }

        // Construir SET clause
        const setClauses = Object.entries(datosActualizacion).map(([columna, valor]) => {
            return `${columna} = ${this.formatearValor(valor)}`;
        });

        let query = `UPDATE ${this.tableName} SET ${setClauses.join(', ')}`;
        query += ` WHERE ${this.construirCondiciones(condiciones)}`;
        
        return query + ';';
    }

    // DELETE - Eliminar registros
    async delete({condiciones}) {
        if (!condiciones) {
            throw new Error('Se requieren condiciones WHERE para eliminar (por seguridad)');
        }

        let query = `DELETE FROM ${this.tableName}`;
        query += ` WHERE ${this.construirCondiciones(condiciones)}`;
        
        return query + ';';
    }

    // Método auxiliar para formatear valores
    formatearValor(valor) {
        if (valor === null || valor === undefined) {
            return 'NULL';
        }
        if (typeof valor === 'string') {
            // Escapar comillas simples para evitar inyección SQL
            return `'${valor.replace(/'/g, "''")}'`;
        }
        if (typeof valor === 'boolean') {
            return valor ? 1 : 0;
        }
        if (valor instanceof Date) {
            return `'${valor.toISOString().slice(0, 19).replace('T', ' ')}'`;
        }
        return valor;
    }

    // Método auxiliar para construir condiciones WHERE
    construirCondiciones(condiciones) {
        if (typeof condiciones === 'string') {
            return condiciones;
        }
        
        if (typeof condiciones === 'object') {
            const clausulas = Object.entries(condiciones).map(([columna, valor]) => {
                if (Array.isArray(valor)) {
                    // Para condiciones IN
                    const valoresFormateados = valor.map(v => this.formatearValor(v));
                    return `${columna} IN (${valoresFormateados.join(', ')})`;
                } else if (typeof valor === 'object' && valor !== null) {
                    // Para operadores especiales como {'>': 100, '<': 200}
                    const subcondiciones = Object.entries(valor).map(([operador, val]) => {
                        return `${columna} ${operador} ${this.formatearValor(val)}`;
                    });
                    return subcondiciones.join(' AND ');
                } else {
                    return `${columna} = ${this.formatearValor(valor)}`;
                }
            });
            return clausulas.join(' AND ');
        }
        
        return condiciones;
    }
}

export default {
    CrearSentencia 
};