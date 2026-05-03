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
      // Logs descentralizados por componente y agrupados por fecha
      new DailyRotateFile({
        // Crea la ruta src/folderName/logs/YYYY-MM-DD/fileName.log
        filename: path.join(__dirname, '../../src', folderName, 'logs', '%DATE%', `${fileName}.log`),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false, // Ahora logManagerService.js se encarga de la compresión por carpetas
        maxSize: '20m',       // Mantenemos el límite de tamaño por archivo diario
        // Se omiten maxFiles y opciones de retención nativas; el logManagerService limpiará los antiguos
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