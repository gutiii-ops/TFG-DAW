const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Caché para evitar crear múltiples instancias del mismo logger (fugas de memoria)
const loggersCache = {};

/**
 * Crea un logger específico dinámico.
 * @param {string} folderName - Subcarpeta o contexto (ej: 'services', 'routes', 'api')
 * @param {string} fileName - Nombre del archivo (ej: 'authService', 'userRoutes')
 */
const getLogger = (folderName, fileName) => {
  const cacheKey = `${folderName}-${fileName}`;

  // Si el logger ya existe en la caché, lo devolvemos
  if (loggersCache[cacheKey]) {
    return loggersCache[cacheKey];
  }

  // Si no existe, lo creamos
  const newLogger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}] [${cacheKey}]: ${message}`;
      })
    ),
    transports: [
      // Rotación de logs centralizada: Todo va directo a la carpeta 'logs'
      new DailyRotateFile({
        // Guarda en backend/logs/services-authService-2023-10-25.log
        filename: path.join(__dirname, '../../logs', `${cacheKey}-%DATE%.log`),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true, // Comprime en .zip los logs de días anteriores
        maxSize: '20m',      // Límite de 20MB por archivo
        maxFiles: '31d'      // Elimina los logs con más de 14 días de antigüedad
      }),
      // Consola para desarrollo
      new transports.Console({
        format: format.combine(format.colorize(), format.simple())
      })
    ],
  });

  // Lo guardamos en la caché y lo devolvemos
  loggersCache[cacheKey] = newLogger;
  return newLogger;
};

module.exports = getLogger;