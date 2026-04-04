/* ==================================================================
                            authMiddleware.js
                        Middleware de autenticación
   ================================================================== */

// Importamos la librería (tendrás que instalarla: npm install bcrypt)
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { email, passwordPlana } = req.body;

    // 1. Buscas el usuario en la BD (imaginemos que ya lo tenemos)
    const usuarioDeLaBD = await Usuario.findOne({ email });

    // 2. Usamos el método 'compare' de bcrypt
    // Le pasamos la contraseña que viene del React y el Hash de la BD
    const esPasswordCorrecta = await bcrypt.compare(passwordPlana, usuarioDeLaBD.passwordHash);

    if (esPasswordCorrecta) {
        // ¡Magia! Coinciden. 
        res.status(200).json({ mensaje: "Login exitoso" });
    } else {
        // No coinciden.
        res.status(401).json({ error: "Credenciales incorrectas" });
    }
};