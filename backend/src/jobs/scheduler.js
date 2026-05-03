const { fork } = require('child_process');
const path = require('path');
const getLogger = require('../utils/logger');

// 1. Importar la configuración JSON
const config = require('../config/jobsConfig.json');

require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const logger = getLogger('jobs', 'scheduler');

// 2. Control maestro de apagado
if (!config.global.enabled) {
    logger.warn('El orquestador está completamente deshabilitado por configuración global.');
    process.exit(0);
}

logger.info('Scheduler iniciado leyendo configuración de jobsConfig.json.');

// 3. Función encargada de ejecutar un script específico con su propio intervalo
const runScript = (scriptName, intervalSeconds) => {
    logger.info(`Lanzando proceso independiente: ${scriptName}...`);

    const scriptPath = path.join(__dirname, scriptName);
    const childProcess = fork(scriptPath);
    const delayMs = intervalSeconds * 1000;

    childProcess.on('close', (code) => {
        if (code === 0) {
            logger.info(`El servicio ${scriptName} terminó con éxito.`);
        } else {
            logger.error(`El servicio ${scriptName} falló con código: ${code}`);
        }

        logger.info(`Esperando ${intervalSeconds} segundos para la próxima ejecución de ${scriptName}...`);
        setTimeout(() => { runScript(scriptName, intervalSeconds); }, delayMs);
    });

    childProcess.on('error', (err) => {
        logger.error(`Error al lanzar el servicio ${scriptName}: ${err.message}`);
        setTimeout(() => { runScript(scriptName, intervalSeconds); }, delayMs);
    });
};

// 4. Iniciar los procesos fork basados en el JSON
for (const [scriptName, settings] of Object.entries(config.forkedJobs)) {
    if (settings.enabled) {
        runScript(scriptName, settings.intervalSeconds);
    } else {
        logger.info(`Script omitido: ${scriptName} está deshabilitado en la configuración.`);
    }
}

// 5. Iniciar la limpieza de logs si está habilitada en el JSON
if (config.internalJobs.logRotation.enabled) {
    const { runLogRotation } = require('./logManagerService');
    const rotationIntervalMs = config.internalJobs.logRotation.intervalHours * 60 * 60 * 1000;

    const runDailyLogRotation = () => {
        logger.info('Lanzando tarea programada de rotación de logs...');
        runLogRotation()
            .catch(err => logger.error(`Fallo crítico en rotación de logs: ${err.message}`))
            .finally(() => {
                logger.info(`Programando siguiente rotación para dentro de ${config.internalJobs.logRotation.intervalHours} horas.`);
                setTimeout(runDailyLogRotation, rotationIntervalMs);
            });
    };

    runDailyLogRotation();
} else {
    logger.info('La rotación de logs está deshabilitada en la configuración.');
}