// src/scripts/scheduler.js
const { fork } = require('child_process');
const path = require('path');
const getLogger = require('../utils/logger');

const logger = getLogger('services', 'scheduler');

// 1. Definimos el tiempo
const SECONDS = 15;
const MILISECONDS = SECONDS * 1000;

// 2. Definimos array de nombres de archivos a ejecutar
const scriptsToRun = ['goliveService.js', 'dbService.js']; 

logger.info(`Scheduler iniciado.`);

// 3. Creamos una función encargada de ejecutar un script específico
const runScript = (scriptName) => {
    logger.info(`Lanzando proceso independiente: ${scriptName}...`);
    
    // 3.1. Definimos la ruta exacta del archivo que queremos ejecutar
    const scriptPath = path.join(__dirname, '../services', scriptName);
    const childProcess = fork(scriptPath);

    // 3.2. Escuchamos cuándo termina el archivo
    childProcess.on('close', (code) => {
        if (code === 0) {
            logger.info(`El servicio ${scriptName} terminó con éxito.`);
        } else {
            logger.error(`El servicio ${scriptName} falló con código: ${code}`);
        }

        // Solo CUANDO TERMINA (ya sea con éxito o error), programamos la siguiente ejecución.
        logger.info(`Esperando ${SECONDS} segundos para la próxima ejecución de ${scriptName}...`);
        setTimeout(() => { runScript(scriptName); }, MILISECONDS);
    });

    // 3.3. Capturar errores graves al intentar lanzar el archivo
    childProcess.on('error', (err) => {
        logger.error(`Error al lanzar el servicio ${scriptName}: ${err.message}`);
        
        // Si no se pudo ni siquiera abrir el archivo, también esperamos para reintentar
        setTimeout(() => { runScript(scriptName); }, MILISECONDS);
    });
};

// 4. Iniciamos el ciclo para cada script en nuestro array
for (const scriptName of scriptsToRun) { runScript(scriptName); }