import {pool} from '../config/database.js';

const sentencias = {};

const ejecutar = async (sentencia) =>{
    try {
        const result = await pool.query(sentencia);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

sentencias.ejecutar = ejecutar;

const ejecutarConParametros = async (sentencia, parametros = []) =>{
    try {
        const result = await pool.query(sentencia, parametros );
        return result;
    } catch (error) {
        console.error(error);
        throw error;        
    }
}

sentencias.ejecutarConParametros = ejecutarConParametros;

export default {
    sentencias
};