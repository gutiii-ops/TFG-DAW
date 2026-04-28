// backend/generarPassword.js

// 1. Importamos la misma librería que usaremos en tu controlador
const bcrypt = require('bcrypt');

const crearHashManual = async (passwordPlana) => {
    try {
        // 2. Generamos el "Salt" (nivel de seguridad 12)
        const salt = await bcrypt.genSalt(12);
        
        // 3. Hasheamos la contraseña
        const hash = await bcrypt.hash(passwordPlana, salt);
        
        console.log(`Tu contraseña plana: ${passwordPlana}`);
        console.log(`Copia este Hash en tu SQL Server:`);
        console.log("--------------------------------------------------");
        console.log(hash); // ¡Este es el churro que tienes que copiar!
        console.log("--------------------------------------------------");
        
    } catch (error) {
        console.error("Error al generar el hash:", error);
    }
};

// Cambia '123456' por la contraseña que quieras tener en la base de datos
crearHashManual('123456789');