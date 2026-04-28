const { createLogger, format, transports } = require('winston');
const path = require('path');

/**
 * Crea un logger específico dinámico.
 * @param {string} folderName - Subcarpeta dentro de 'logs' (ej: 'services', 'routes', 'api')
 * @param {string} fileName - Nombre del archivo (ej: 'authService', 'userRoutes')
 */
const getLogger = (folderName, fileName) => {
  return createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      })
    ),
    transports: [
      // Aquí está la magia: la ruta ahora usa 'folderName' y 'fileName'
      new transports.File({ 
        filename: path.join('logs', folderName, `${fileName}.log`) 
      }),
      // Consola para desarrollo
      new transports.Console({
        format: format.combine(format.colorize(), format.simple())
      })
    ],
  });
};

module.exports = getLogger;