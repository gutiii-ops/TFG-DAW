/* =======================================================================================================================
          login.jsx - Componente funcional que gestiona el modal flotante de inicio de sesión y registro
======================================================================================================================= */
// Import base de React y hooks necesarios
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext.js'
// Import de iconos SVG
import LockIcon from '../assets/icons/lock-login_icon.svg?react'
// Import de la función de autenticación (servicio mock/real)
import { authUser, registerUser } from '../api/authService.js'
// Import del componente reutilizable para la selección de fecha
import { CustomDatePicker } from './CustomDatePicker.jsx'
// Import de estilos específicos para el modal de login
import '../styles/components/login.css'

import { InputField } from './common/InputField.jsx'
import { SelectField } from './common/SelectField.jsx'
import { EU_COUNTRIES } from '../utils/constants.js'

export const Login = () => {
    const { login: contextLogin, isAuthenticated } = useContext(AuthContext)
    const { addNotification } = useNotification()
    const navigate = useNavigate()
  
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
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
  
    useEffect(() => {
      const handleOpenLogin = () => { setIsOpen(true) }
      if (window.location.pathname === '/login') { setIsOpen(true) }
      document.addEventListener('openLoginModal', handleOpenLogin)
      return () => { document.removeEventListener('openLoginModal', handleOpenLogin) }
    }, [])
  
    const toggleMode = () => {
      setIsLogin(!isLogin)
      setPassword(''); setConfirmPassword(''); setName('');
      setLastName(''); setPhone(''); setDocumentId(''); setBirthDate(''); setCountry('');
    }
  
    const handleSubmit = async (event) => {
      event.preventDefault()
  
      if (!isLogin && password !== confirmPassword) {
        addNotification('Las contraseñas no coinciden', 'error')
        return
      }
  
      setLoading(true)
  
      try {
        if (isLogin) {
          const authResult = await authUser(email, password)
  
          if (authResult.error) {
            throw new Error(authResult.error)
          }
  
          contextLogin(authResult.token)
          setEmail(''); setPassword('')
          setIsOpen(false)
        } else {
          const regResult = await registerUser({
            name, lastName, phone, documentId, birthDate, country, email, password
          });

          if (regResult.error) {
            throw new Error(regResult.error);
          }

          addNotification('Registro exitoso', 'success');
          setIsOpen(false);
          setIsLogin(true);
        }
        setLoading(false)
      } catch (err) {
        setLoading(false)
        addNotification(err.message || 'Error en la operación', 'error')
        if (isLogin) setIsOpen(false)
      }
    }

  if (isAuthenticated || !isOpen) return null

  return (
    <div className='login-overlay' onClick={() => setIsOpen(false)}>
      <div className={`login-container ${!isLogin ? 'book-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button type='button' className='login-close-button' onClick={() => setIsOpen(false)}>
          <LockIcon className='close-icon' />
        </button>

        <form onSubmit={handleSubmit} className='login-form'>
          <h2 className="login-title">{isLogin ? 'Iniciar sesión' : 'Registro de Usuario'}</h2>

          <div className="form-content-wrapper">
            {/* Panel Izquierdo: Información Personal (Solo en registro) */}
            {!isLogin && (
              <div className="form-panel personal-panel">
                <p className="section-title">Información Personal</p>
                <div className='login-row'>
                  <InputField id='register-name' label='Nombre' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                  <InputField id='register-lastname' label='Apellido' type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <InputField id='register-phone' label='Teléfono' type='tel' value={phone} onChange={(e) => setPhone(e.target.value)} />
                <InputField id='register-document' label='Documento ID' type='text' value={documentId} onChange={(e) => setDocumentId(e.target.value)} />
                <div className='login-row'>
                  <CustomDatePicker id='register-birth' label='Fecha Nacimiento' placeholder='dd/mm/aaaa' value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                  <SelectField id='register-country' label='País' value={country} onChange={(e) => setCountry(e.target.value)} options={EU_COUNTRIES} />
                </div>
              </div>
            )}

            {/* Panel Derecho / Principal: Credenciales */}
            <div className="form-panel credentials-panel">
              {!isLogin && <p className="section-title">Credenciales de Acceso</p>}
              <InputField id='login-email' label='Correo Electrónico' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
              <InputField id='login-password' label='Contraseña' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
              {!isLogin && (
                <InputField id='register-confirm-password' label='Confirmar Contraseña' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              )}
              
              <button type='submit' disabled={loading} className='login-submit-button'>
                {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Finalizar Registro'}
              </button>

              <div className='login-toggle-text'>
                {isLogin ? '¿No tienes cuenta? ' : '¿Prefieres volver? '}
                <button type='button' className='login-toggle-btn' onClick={toggleMode}>
                  {isLogin ? 'Regístrate aquí' : 'Ir al Login'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
