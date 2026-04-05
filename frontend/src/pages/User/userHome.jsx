/* =======================================================================================================================
          userHome.jsx - Página principal del Dashboard del Usuario
======================================================================================================================= */
import React, { useState, useEffect } from 'react'
import { Navbar } from '../../components/navbar.jsx'
import { Footer } from '../../components/footer.jsx'
import { getUserData, updateUserData } from '../../api/userService.js'
import { getUserReservations } from '../../api/reservationService.js'
import { getUserOrders } from '../../api/orderService.js'
import { useNavigate } from 'react-router-dom'
import '../../styles/pages/userHome.css'

// Nuevos componentes refactorizados
import { UserHeader } from '../../components/user/UserHeader.jsx'
import { UserProfile } from '../../components/user/UserProfile.jsx'
import { UserReservations } from '../../components/user/UserReservations.jsx'
import { UserOrders } from '../../components/user/UserOrders.jsx'
import { HelpModal } from '../../components/user/HelpModal.jsx'

const UserHome = () => {
  // Estados de UI
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  // Estados de datos
  const [userData, setUserData] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [reservations, setReservations] = useState([])
  const [orders, setOrders] = useState([])

  // Estados de carga
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [savingProfile, setSavingProfile] = useState(false)

  // Obtener userId del localStorage (guardado durante la autenticación)
  const userId = localStorage.getItem('userId')
  const navigate = useNavigate()

  // Función para desloguear y redirigir
  const forceLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    window.dispatchEvent(new Event('auth-change'))
    navigate('/')
  }

  // Cargar datos cuando el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setError('Usuario no autenticado')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Cargar datos del usuario, reservas y pedidos en paralelo
        const [userRes, reservationsRes, ordersRes] = await Promise.all([
          getUserData(userId),
          getUserReservations(userId),
          getUserOrders(userId)
        ])

        // Manejar errores en las respuestas
        if (userRes.error) throw new Error(userRes.error)
        if (reservationsRes.error) throw new Error(reservationsRes.error)
        if (ordersRes.error) throw new Error(ordersRes.error)

        // Actualizar estados con los datos de la base de datos
        setUserData(userRes)
        setEditForm(userRes)
        setReservations(Array.isArray(reservationsRes) ? reservationsRes : [])
        setOrders(Array.isArray(ordersRes) ? ordersRes : [])
      } catch (err) {
        console.error('Error al cargar datos:', err)
        const errMsg = err.message ? err.message.toLowerCase() : ''
        
        // Si el error huele a token inválido, caducado o servidor caído, forzamos salida
        if (errMsg.includes('token') || errMsg.includes('jwt') || errMsg.includes('no autenticado') || errMsg.includes('unauthorized') || errMsg.includes('fetch')) {
          forceLogout()
          return
        }

        setError(err.message || 'Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const handleProfileEdit = () => {
    setIsEditingProfile(true)
    setEditForm(userData)
  }

  const handleProfileSave = async () => {
    try {
      setSavingProfile(true)
      const result = await updateUserData(userId, editForm)

      if (result.error) throw new Error(result.error)

      setUserData(result)
      setEditForm(result)
      setIsEditingProfile(false)
    } catch (err) {
      console.error('Error al guardar perfil:', err)
      setError(err.message || 'Error al guardar los cambios')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm({ ...editForm, [name]: value })
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const currentDate = new Date(2026, 3) // Abril 2026
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const calendarDays = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className='user-home'>
        {/* Mostrar error si existe */}
        {error && (
          <div className='error-banner'>
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* Mostrar carga mientras se obtienen datos */}
        {loading ? (
          <div className='loading-container'>
            <p>Cargando tu información...</p>
          </div>
        ) : userData ? (
          <>
            {/* Header de bienvenida componente */}
            <UserHeader userData={userData} setShowHelpModal={setShowHelpModal} />

            {/* Tabs de navegación */}
            <section className='user-tabs'>
              <div className='tab-buttons'>
                <button
                  className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Mi Perfil
                </button>
                <button
                  className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reservations')}
                >
                  Mis Reservas
                </button>
                <button
                  className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  Mis Pedidos
                </button>
              </div>
            </section>

            {/* Contenido de Tabs inyectando el componente correspondiente */}
            <div className='tabs-container'>
              {activeTab === 'profile' && (
                <UserProfile
                  userData={userData}
                  editForm={editForm}
                  isEditingProfile={isEditingProfile}
                  savingProfile={savingProfile}
                  handleInputChange={handleInputChange}
                  handleProfileEdit={handleProfileEdit}
                  handleProfileSave={handleProfileSave}
                  setIsEditingProfile={setIsEditingProfile}
                />
              )}

              {activeTab === 'reservations' && (
                <UserReservations
                  reservations={reservations}
                  calendarDays={calendarDays}
                />
              )}

              {activeTab === 'orders' && (
                <UserOrders orders={orders} />
              )}
            </div>
          </>
        ) : (
          <div className='loading-container'>
            <p>No se pudo cargar la información del usuario</p>
          </div>
        )}
      </main>

      {/* Modal de Ayuda */}
      {showHelpModal && (
        <HelpModal setShowHelpModal={setShowHelpModal} />
      )}

      <footer>
        <Footer />
      </footer>
    </>
  )
}

export default UserHome
