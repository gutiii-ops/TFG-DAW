const sql = require('mssql');
const getLogger = require('../utils/logger');
require('dotenv').config();

// Configuración del logger
const logger = getLogger('services', 'dbService');

// Configuración de la conexión a la base de datos
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Crear un pool de conexiones
const pool = new sql.ConnectionPool(config);

// Función para conectar a la base de datos
const connectDB = async () => {
    try {
        await pool.connect();
        logger.info('Conexión a la base de datos exitosa');
    } catch (error) {
        logger.error('Error al conectar a la base de datos:', error);
    }
};

// Función para cerrar la conexión a la base de datos
const closeDB = async () => {
    try {
        await pool.close();
        logger.info('Conexión a la base de datos cerrada');
    } catch (error) {
        logger.error('Error al cerrar la conexión a la base de datos:', error);
    }
};

// Función para medir el tiempo de respuesta de la base de datos
const responseTime = async () => {
    try {
        // Si no hay conexión, se conecta
        if (!pool.connected) { await connectDB(); }

        // Medimos el tiempo de respuesta de la base de datos
        const startTime = performance.now();
        await pool.request().query('SELECT 1');
        const endTime = performance.now();

        // Calculamos el tiempo de respuesta
        const responseTime = (endTime - startTime).toFixed(2);
        logger.info(`Tiempo de respuesta de la base de datos: ${responseTime}ms`);
        return responseTime;

    } catch (error) {
        logger.error('Error al medir el tiempo de respuesta de la base de datos:', error);
        throw error;
    }
};

module.exports = {
    connectDB,
    closeDB,
    pool,
    responseTime
};