// src/scripts/instalarServicio.js
const { Service } = require('node-windows');
const path = require('path');
const getLogger = require('../utils/logger');

const logger = getLogger('scripts', 'serviceInstallation');

// 1. Configurar el servicio
const svc = new Service({
    name: 'GymMgmt Scheduler', 
    description: 'Orquestador principal de tareas en segundo plano de GymMgmt',

    // RUTA ABSOLUTA a tu orquestador
    script: path.join(__dirname, '../jobs/scheduler.js'),

    wait: 2,
    grow: .5,
    maxRestarts: 10
});

// 2. Eventos del ciclo de vida del servicio
svc.on('install', () => {
    logger.info('Servicio de GymMgmt para Windows instalado correctamente.');
    logger.info('Inicializando el Scheduler...');
    svc.start(); 
});

svc.on('start', () => {
    logger.info('Scheduler iniciado correctamente y ejecutándose en segundo plano.');
});

// 3. Lógica de reinstalación
svc.on('alreadyinstalled', () => {
    logger.info('El servicio ya estaba instalado. Procediendo a desinstalar...');
    svc.uninstall();
});

svc.on('uninstall', () => {
    logger.info('Servicio anterior desinstalado. Reinstalando con la nueva configuración...');
    svc.install();
});

// 4. Ejecutar el flujo
svc.install();
