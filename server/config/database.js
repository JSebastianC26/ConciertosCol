import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;


export const pool = new pg.Pool({
    host:DB_HOST,
    port:DB_PORT,
    database:DB_NAME,
    user:DB_USER,
    password:DB_PASSWORD
});
