/* ==============================================================
                        userService.js
        Servicio para obtener y actualizar datos del usuario.
================================================================ */

const normalizeUserData = (raw) => {
  if (!raw) return null
  const fullName = [raw.user_name, raw.user_surname]
    .filter(Boolean)
    .join(' ')
    .trim()
  return {
    id: raw.user_id,
    name: fullName || '',
    email: raw.user_email,
    phone: raw.user_phone,
    documentId: raw.user_IdDocument,
    region: raw.user_region,
    memberSince: raw.user_date
  }
}

export const getUserData = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Error al obtener datos del usuario')
    }

    const data = await response.json()
    return normalizeUserData(data)
  } catch (error) {
    console.error('Error en getUserData:', error)
    return { error: error.message }
  }
}

const buildUpdatePayload = (userData) => {
  const payload = {}

  if (userData.name) {
    const [firstName, ...lastNameParts] = userData.name.trim().split(/\s+/)
    payload.user_name = firstName
    payload.user_surname = lastNameParts.join(' ') || ''
  }

  if (userData.email) payload.user_email = userData.email
  if (userData.phone) payload.user_phone = userData.phone
  if (userData.region) payload.user_region = userData.region
  if (userData.documentId) payload.user_IdDocument = userData.documentId
  if (userData.memberSince) payload.user_date = userData.memberSince

  return payload
}

export const updateUserData = async (userId, userData) => {
  try {
    const payload = buildUpdatePayload(userData)
    const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || 'Error al actualizar datos del usuario'
      )
    }

    const data = await response.json()
    return normalizeUserData(data)
  } catch (error) {
    console.error('Error en updateUserData:', error)
    return { error: error.message }
  }
}
