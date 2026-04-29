const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const archiver = require('archiver');
const getLogger = require('../utils/logger');

const logger = getLogger('jobs', 'logManagerService');
const SRC_DIR = path.join(__dirname, '../../src');

// Función auxiliar para comprimir una carpeta
function zipDirectory(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fsSync.createWriteStream(outPath);

    archive
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(stream);

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

// Escanea recursivamente buscando carpetas "logs"
async function findLogDirectories(dir, logDirs = []) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(dir, entry.name);
        if (entry.name === 'logs') {
          logDirs.push(fullPath);
        } else if (entry.name !== 'node_modules') {
          // Busca recursivamente pero ignora node_modules por si acaso
          await findLogDirectories(fullPath, logDirs);
        }
      }
    }
  } catch (err) {
    logger.error(`Error buscando directorios de logs en ${dir}: ${err.message}`);
  }
  return logDirs;
}

async function processLogDirectory(logDirPath) {
  try {
    const entries = await fs.readdir(logDirPath, { withFileTypes: true });
    const now = new Date();
    // Normalizar hora para calcular diferencia de días correctamente
    now.setHours(0, 0, 0, 0);

    for (const entry of entries) {
      // Solo procesamos las carpetas de fecha
      if (entry.isDirectory()) {
        const dateStr = entry.name;
        // Validar formato simple YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          const folderDate = new Date(dateStr);
          folderDate.setHours(0, 0, 0, 0);
          
          // Calcular días de antigüedad
          const diffTime = Math.abs(now - folderDate);
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays >= 5) {
            const folderPath = path.join(logDirPath, entry.name);
            const zipPath = path.join(logDirPath, `${entry.name}.zip`);
            
            logger.info(`Comprimiendo carpeta antigua: ${folderPath}`);
            try {
              await zipDirectory(folderPath, zipPath);
              logger.info(`Compresión completada: ${zipPath}`);
              
              // Si la compresión fue exitosa, borramos la carpeta original
              await fs.rm(folderPath, { recursive: true, force: true });
              logger.info(`Carpeta original eliminada: ${folderPath}`);
            } catch (zipErr) {
              logger.error(`Error al comprimir/eliminar ${folderPath}: ${zipErr.message}`);
            }
          }
        }
      }
    }
  } catch (err) {
    logger.error(`Error procesando directorio ${logDirPath}: ${err.message}`);
  }
}

async function runLogRotation() {
  logger.info('Iniciando proceso de rotación y limpieza de logs descentralizados...');
  const logDirs = await findLogDirectories(SRC_DIR);
  
  if (logDirs.length === 0) {
    logger.info('No se encontraron carpetas de logs.');
    return;
  }
  
  for (const logDir of logDirs) {
    await processLogDirectory(logDir);
  }
  logger.info('Proceso de rotación de logs finalizado.');
}

module.exports = {
  runLogRotation
};
