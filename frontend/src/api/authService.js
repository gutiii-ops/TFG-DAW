/* ==============================================================
                        authService.js
        Servicio para manejar la autenticación de usuarios.
================================================================ */

const BASE_URL = 'http://localhost:8000/api/auth';

/**
 * Inicia sesión en el sistema.
 */
export const authUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Error en la autenticación')
    }

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Registra un nuevo usuario en la BBDD real.
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Error al registrar el usuario')
    }

    const data = await response.json()
    return data
  } catch (error) {
    return { error: error.message }
  }
}
