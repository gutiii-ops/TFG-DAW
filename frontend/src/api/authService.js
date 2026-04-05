/* ==============================================================
                        authService.js
        Servicio para manejar la autenticación de usuarios.
================================================================ */

export const authUser = async (email, password) => {
  try {
    const response = await fetch('http://localhost:8000/api/login', {
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
