/* ==============================================================
                        authService.js
        Servicio para manejar la autenticación de usuarios.
================================================================ */

export const authUser = async (type, email, password) => {
  const credentials = { type, email, password };
  try {
    // Mandamos una solicitud POST al backend para autenticar al usuario
    console.log('Enviando solicitud de autenticación al backend con:', credentials);
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credentials }),
    });

    if (!response.ok) {
      throw new Error('Error en la autenticación');
    } else {
      const data = await response.json();
      return data; // Devuelve el token de autenticación
    }
  } catch (error) {
    return { error: error.message };
  }
};