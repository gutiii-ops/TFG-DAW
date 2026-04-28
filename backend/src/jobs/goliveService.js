require('dotenv').config();
const net = require('net');
const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 8000;
const HOST = '127.0.0.1';

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
  console.log(`[LiveService] Verificando estado del servidor en ${HOST}:${PORT}...`);
  const isRunning = await checkServer();

  if (isRunning) {
    console.log(`[LiveService] ✅ El servidor ya está corriendo y escuchando en el puerto ${PORT}.`);
    return true;
  } else {
    console.log(`[LiveService] ❌ El servidor NO está corriendo. Iniciando proceso...`);
    
    const mainScriptPath = path.join(__dirname, '..', 'main.js');
    const backendDir = path.join(__dirname, '..', '..');
    
    const serverProcess = spawn('node', [mainScriptPath], {
      cwd: backendDir,
      detached: true,
      stdio: 'ignore'
    });

    serverProcess.unref(); 
    
    console.log('[LiveService] 🚀 Servidor iniciado en segundo plano.');
    return false;
  }
}

// Exportamos la función para que el Scheduler la llame en lugar de ejecutarla aquí
module.exports = {
  monitorServer
};