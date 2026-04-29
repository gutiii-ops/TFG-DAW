// src/scripts/scheduler.js
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { fork } = require('child_process');
const path = require('path');
const getLogger = require('../utils/logger');

const logger = getLogger('jobs', 'scheduler');

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
    const scriptPath = path.join(__dirname, scriptName);
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

// 5. Iniciamos la limpieza de logs diaria (sin fork, se ejecuta aquí mismo)
const { runLogRotation } = require('./logManagerService');
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const runDailyLogRotation = () => {
    logger.info('Lanzando tarea diaria de rotación de logs...');
    runLogRotation()
        .catch(err => logger.error(`Fallo crítico en rotación de logs: ${err.message}`))
        .finally(() => {
            logger.info('Programando siguiente rotación para dentro de 24 horas.');
            setTimeout(runDailyLogRotation, ONE_DAY_MS);
        });
};

runDailyLogRotation();