import React, { useState, useEffect } from 'react'
import LockIcon from '../assets/icons/lock-login_icon.svg?react';
import { authUser } from '../api/authService.js'
import '../styles/components/login.css';

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Escuchar el evento customizado del navbar
    const handleOpenLogin = () => {
      setIsOpen(true)
    }

    document.addEventListener('openLoginModal', handleOpenLogin)

    // Limpiar el listener cuando el componente se desmonta
    return () => {
      document.removeEventListener('openLoginModal', handleOpenLogin)
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Aquí puedes integrar la llamada real al backend o al servicio de auth.
      await new Promise((resolve) => setTimeout(resolve, 800))
      setLoading(false)
      setIsOpen(false)
    } catch (err) {
      setLoading(false)
      setError('No se pudo iniciar sesión. Por favor revisa tus credenciales.')
    }
  }

  return (
    <>
      <button
        className='login-open-button'
        type='button'
        onClick={() => setIsOpen(true)}
      >
        Iniciar sesión
      </button>

      {isOpen && (
        <div className='login-overlay' onClick={() => setIsOpen(false)}>
          <div
            className='login-container'
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type='button'
              className='login-close-button'
              onClick={() => setIsOpen(false)}
            ><LockIcon className="close-icon"/></button>

            <form onSubmit={handleSubmit} className='login-form'>
              <h2>Iniciar sesión</h2>
              {error && <p className='login-error'>{error}</p>}

              <label htmlFor='login-email'>Email</label>
              <input
                id='login-email'
                type='email'
                placeholder='correo@ejemplo.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor='login-password'>Contraseña</label>
              <input
                id='login-password'
                type='password'
                placeholder='Tu contraseña'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type='submit'
                disabled={loading}
                onClick={() => authUser({ email, password })}
                className='login-submit-button'
              >
                {loading ? 'Cargando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
