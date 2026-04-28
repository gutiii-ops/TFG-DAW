require('dotenv').config();
const net = require('net');
const { spawn } = require('child_process');
const path = require('path');
const getLogger = require('../utils/logger');

const logger = getLogger('services', 'goliveService');

const PORT = process.env.PORT || 8000;
const HOST = 'localhost';

/**
 * Intenta conectarse al puerto del servidor para verificar si está activo.
 * @returns {Promise<boolean>}
 */
function checkServer() {
  return new Promise((resolve) => {
    const socket = new net.Socket();

    const onError = () => {
      socket.destroy();
      resolve(false); // No está escuchando
    };

    socket.setTimeout(2000);
    socket.on('timeout', onError);
    socket.on('error', onError);

    socket.connect(PORT, HOST, () => {
      socket.destroy();
      resolve(true); // Está escuchando
    });
  });
}

/**
 * Función principal que orquesta la verificación y el reinicio si es necesario.
 */
async function monitorServer() {
  logger.info(`Verificando estado del servidor en ${HOST}:${PORT}...`);
  const isRunning = await checkServer();

  if (isRunning) {
    logger.info(`El servidor ya está levantado y escuchando en el puerto ${PORT}.`);
    return true;
  } else {
    logger.warn(`El servidor NO está levantado. Iniciando proceso...`);
    
    const mainScriptPath = path.join(__dirname, '..', 'main.js');
    const backendDir = path.join(__dirname, '..', '..');
    
    const serverProcess = spawn('node', [mainScriptPath], {
      cwd: backendDir,
      detached: true,
      stdio: 'ignore'
    });

    serverProcess.unref(); 
    
    logger.info('Servidor iniciado en segundo plano.');
    return false;
  }
}

// Exportamos la función para que el Scheduler la llame en lugar de ejecutarla aquí
module.exports = {
  monitorServer
};