/* ==============================================================
                        reservationService.js
        Servicio para obtener y gestionar reservas de clases.
================================================================ */

export const getUserReservations = async (userId) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/reservations/user/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    if (!response.ok) {
      throw new Error('Error al obtener reservas')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en getUserReservations:', error)
    return { error: error.message }
  }
}

export const createReservation = async (reservationData) => {
  try {
    const response = await fetch('http://localhost:8000/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(reservationData)
    })
    if (!response.ok) {
      throw new Error('Error al crear reserva')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en createReservation:', error)
    return { error: error.message }
  }
}

export const cancelReservation = async (reservationId) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/reservations/${reservationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    if (!response.ok) {
      throw new Error('Error al cancelar reserva')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en cancelReservation:', error)
    return { error: error.message }
  }
}
