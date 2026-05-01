const sql = require('mssql');
const path = require('path');
const getLogger = require('../utils/logger');

require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const logger = getLogger('config', 'dbConfig');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        logger.info('Conectado a SQL Server');
        return pool;
    })
    .catch(err => {
        logger.error(`Error de conexión a la base de datos: ${err.message}`);
        throw err;
    });

module.exports = {
    sql,
    poolPromise
};
