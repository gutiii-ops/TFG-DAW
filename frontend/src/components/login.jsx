/* =======================================================================================================================
          login.jsx - Componente funcional que gestiona el modal flotante de inicio de sesión y registro
======================================================================================================================= */
// Import base de React y hooks necesarios
import React, { useState, useEffect } from 'react'
// Import de iconos SVG
import LockIcon from '../assets/icons/lock-login_icon.svg?react'
// Import de la función de autenticación (servicio mock/real)
import { authUser } from '../api/authService.js'
// Import del componente reutilizable para la selección de fecha
import { CustomDatePicker } from './CustomDatePicker.jsx'
// Import de estilos específicos para el modal de login
import '../styles/components/login.css'

// Componente reutilizable para los inputs estándar de texto y contraseñas
const InputField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = true
}) => (
  <div className='input-group'>
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
)

// Componente reutilizable genérico para menús desplegables HTML (select)
const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  required = true,
  defaultOption = 'Selecciona...'
}) => (
  <div className='input-group'>
    <label htmlFor={id}>{label}</label>
    <select id={id} value={value} onChange={onChange} required={required}>
      <option value='' disabled>
        {defaultOption}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
)

// Constante estática con los países de la UE para el SelectField del registro
const EU_COUNTRIES = [
  'Alemania',
  'Austria',
  'Bélgica',
  'Bulgaria',
  'Chipre',
  'Croacia',
  'Dinamarca',
  'Eslovaquia',
  'Eslovenia',
  'España',
  'Estonia',
  'Finlandia',
  'Francia',
  'Grecia',
  'Hungría',
  'Irlanda',
  'Italia',
  'Letonia',
  'Lituania',
  'Luxemburgo',
  'Malta',
  'Países Bajos',
  'Polonia',
  'Portugal',
  'República Checa',
  'Rumanía',
  'Suecia'
]

// Componente funcional principal que encapsula ambas pantallas: Inicio de sesión y Registro
export const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [documentId, setDocumentId] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar si hay sesión activa al montar
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token')
      setIsAuthenticated(!!token)
    }
    
    checkAuthStatus()

    // Escuchar cambios de estado desde otras partes
    window.addEventListener('auth-change', checkAuthStatus)

    // Escuchar el evento customizado del navbar para abrir modal
    const handleOpenLogin = () => {
      setIsOpen(true)
    }

    document.addEventListener('openLoginModal', handleOpenLogin)

    return () => {
      window.removeEventListener('auth-change', checkAuthStatus)
      document.removeEventListener('openLoginModal', handleOpenLogin)
    }
  }, [])

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setPassword('')
    setConfirmPassword('')
    setName('')
    setLastName('')
    setPhone('')
    setDocumentId('')
    setBirthDate('')
    setCountry('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!isLogin && password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        const authResult = await authUser(email, password)

        if (authResult.error) {
          throw new Error(authResult.error)
        }

        localStorage.setItem('token', authResult.token)
        localStorage.setItem('userId', authResult.userId)
        setIsAuthenticated(true)
        window.dispatchEvent(new Event('auth-change'))
        setEmail('')
        setPassword('')
      } else {
        // Registro offline temporal: todavía no hay endpoint de registro completo.
        console.log('Registro simulado con datos:', {
          name,
          lastName,
          phone,
          documentId,
          birthDate,
          country,
          email
        })
      }

      setLoading(false)
      setIsOpen(false)
    } catch (err) {
      setLoading(false)
      setError(
        isLogin
          ? `No se pudo iniciar sesión. ${err.message}`
          : 'Hubo un error al crear tu cuenta. Verifica tus datos.'
      )
    }
  }

  // Componente estrictamente visual (Modal Portal).
  // Si no está abierto o ya iniciaste sesión, no se pinta nada.
  if (isAuthenticated || !isOpen) return null

  return (
    <div className='login-overlay' onClick={() => setIsOpen(false)}>
      <div
        className='login-container'
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type='button'
          className='login-close-button'
          onClick={() => setIsOpen(false)}
        >
          <LockIcon className='close-icon' />
        </button>

            <form onSubmit={handleSubmit} className='login-form'>
              <h2>{isLogin ? 'Iniciar sesión' : 'Crea tu cuenta'}</h2>
              {error && <p className='login-error'>{error}</p>}

              {!isLogin && (
                <>
                  <div className='login-row'>
                    <InputField
                      id='register-name'
                      label='Nombre'
                      type='text'
                      placeholder='Tu nombre'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <InputField
                      id='register-lastname'
                      label='Apellido'
                      type='text'
                      placeholder='Tu apellido'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className='login-row'>
                    <InputField
                      id='register-phone'
                      label='Teléfono'
                      type='tel'
                      placeholder='+34 ...'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <InputField
                      id='register-document'
                      label='DNI/NIE/Pas. '
                      type='text'
                      placeholder='Documento'
                      value={documentId}
                      onChange={(e) => setDocumentId(e.target.value)}
                    />
                  </div>
                  <div className='login-row'>
                    <CustomDatePicker
                      id='register-birth'
                      label='Fech. Nacimiento'
                      placeholder='dd/mm/aaaa'
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                    <SelectField
                      id='register-country'
                      label='País'
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      options={EU_COUNTRIES}
                      defaultOption='Elegir país...'
                    />
                  </div>
                </>
              )}

              <InputField
                id='login-email'
                label='Email'
                type='email'
                placeholder='correo@ejemplo.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <InputField
                id='login-password'
                label='Contraseña'
                type='password'
                placeholder='Tu contraseña'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {!isLogin && (
                <InputField
                  id='register-confirm-password'
                  label='Confirmar Contraseña'
                  type='password'
                  placeholder='Repite tu contraseña'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              )}

              <button
                type='submit'
                disabled={loading}
                className='login-submit-button'
              >
                {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarse'}
              </button>

              <div className='login-toggle-text'>
                {isLogin ? '¿No tienes cuenta? ' : '¿Ya eres miembro? '}
                <button
                  type='button'
                  className='login-toggle-btn'
                  onClick={toggleMode}
                >
                  {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                </button>
              </div>
            </form>
      </div>
    </div>
  )
}


