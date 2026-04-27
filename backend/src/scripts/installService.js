// src/scripts/installService.js
const { Service } = require('node-windows');
const path = require('path');

// 1. Configurar el servicio
const svc = new Service({
  name: 'GymMgmt Scheduler', // El nombre que verás en Windows
  description: 'Orquestador principal de tareas en segundo plano de GymMgmt',
  
  // RUTA ABSOLUTA a tu orquestador
  script: path.join(__dirname, '../services/scheduler.js'),
  
  // Reinicia el script si por algún motivo fatal se cierra
  wait: 2,
  grow: .5,
  maxRestarts: 10
});

// 2. ¿Qué hacer cuando se instale?
svc.on('install', () => {
  console.log('Servicio de Windows instalado correctamente.');
  console.log('Iniciando el Scheduler...');
  
  // Escuchamos el evento 'start' en el objeto 'svc'
  svc.on('start', () => {
    console.log('Scheduler iniciado correctamente.');
  });

  // Llamamos al método start() para que se ejecute
  svc.start();
});

svc.on('alreadyinstalled', () => {
  console.log('El servicio ya estaba instalado.');
});

// 3. Ejecutar la instalación
svc.install();
