/* =======================================================================================================================
          login.jsx - Componente funcional que gestiona el modal flotante de inicio de sesión y registro
======================================================================================================================= */
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext.js'
import LockIcon from '../assets/icons/lock-login_icon.svg?react'
import { authUser, registerUser } from '../api/authService.js'
import { CustomDatePicker } from './CustomDatePicker.jsx'
import '../styles/components/login.css'

// Componente con etiquetas flotantes/internas para máxima limpieza visual
const InputField = ({ id, label, type, placeholder, value, onChange, required = true }) => (
  <div className={`input-group ${value ? 'has-value' : ''}`}>
    <input
      id={id}
      type={type}
      placeholder=" " // Necesario para la lógica de CSS :placeholder-shown
      value={value}
      onChange={onChange}
      required={required}
    />
    <label htmlFor={id}>{label}</label>
  </div>
)

const SelectField = ({ id, label, value, onChange, options, required = true, defaultOption = 'Selecciona...' }) => (
  <div className={`input-group select-group ${value ? 'has-value' : ''}`}>
    <select id={id} value={value} onChange={onChange} required={required}>
      <option value='' disabled></option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <label htmlFor={id}>{label}</label>
  </div>
)

const EU_COUNTRIES = [
  'Alemania', 'Austria', 'Bélgica', 'Bulgaria', 'Chipre', 'Croacia', 'Dinamarca',
  'Eslovaquia', 'Eslovenia', 'España', 'Estonia', 'Finlandia', 'Francia', 'Grecia',
  'Hungría', 'Irlanda', 'Italia', 'Letonia', 'Lituania', 'Luxemburgo', 'Malta',
  'Países Bajos', 'Polonia', 'Portugal', 'República Checa', 'Rumanía', 'Suecia'
]

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
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
  
    useEffect(() => {
      const handleOpenLogin = () => { setIsOpen(true) }
      document.addEventListener('openLoginModal', handleOpenLogin)
      return () => { document.removeEventListener('openLoginModal', handleOpenLogin) }
    }, [])
  
    const toggleMode = () => {
      setIsLogin(!isLogin)
      setError(''); setPassword(''); setConfirmPassword(''); setName('');
      setLastName(''); setPhone(''); setDocumentId(''); setBirthDate(''); setCountry('');
    }
  
    const handleSubmit = async (event) => {
      event.preventDefault()
      setError('')
  
      if (!isLogin && password !== confirmPassword) {
        addNotification('Las contraseñas no coinciden', 'error')
        return
      }
  
      setLoading(true)
  
      try {
        if (isLogin) {
          const authResult = await authUser(email, password)
          if (authResult.error) throw new Error(authResult.error)
          contextLogin(authResult.token)
          setIsOpen(false)
          navigate('/dashboard')
        } else {
          const regResult = await registerUser({ name, lastName, phone, documentId, birthDate, country, email, password });
          if (regResult.error) throw new Error(regResult.error);
          addNotification('Registro exitoso', 'success');
          setIsOpen(false);
          setIsLogin(true);
        }
      } catch (err) {
        addNotification(err.message, 'error')
        if (isLogin) setIsOpen(false)
      } finally {
        setLoading(false)
      }
    }

  if (isAuthenticated || !isOpen) return null

  return (
    <div className='login-overlay' onClick={() => setIsOpen(false)}>
      <div className={`login-container ${!isLogin ? 'register-mode' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button type='button' className='login-close-button' onClick={() => setIsOpen(false)}>
          <LockIcon className='close-icon' />
        </button>

        <form onSubmit={handleSubmit} className='login-form'>
          <div className="form-header">
             <h2>{isLogin ? 'Bienvenido' : 'Únete al Club'}</h2>
             <p className="form-subtitle">{isLogin ? 'Accede a tu panel premium' : 'Crea tu perfil de atleta en 2 pasos'}</p>
          </div>

          <div className="book-layout">
            {/* APARTADO IZQUIERDO: Información del Usuario */}
            <div className="book-page user-info-page">
              {!isLogin && (
                <>
                  <p className="section-tag">Identidad</p>
                  <div className='login-row'>
                    <InputField id='register-name' label='Nombre' type='text' value={name} onChange={(e) => setName(e.target.value)} />
                    <InputField id='register-lastname' label='Apellido' type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                  <div className='login-row'>
                    <InputField id='register-phone' label='Teléfono' type='tel' value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <InputField id='register-document' label='Documento (DNI/NIE)' type='text' value={documentId} onChange={(e) => setDocumentId(e.target.value)} />
                  </div>
                  <div className='login-row'>
                    <CustomDatePicker id='register-birth' label='Fecha de Nacimiento' value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                    <SelectField id='register-country' label='País de Residencia' value={country} onChange={(e) => setCountry(e.target.value)} options={EU_COUNTRIES} />
                  </div>
                </>
              )}
              {isLogin && (
                 <div className="login-visual-hint">
                    <div className="glow-orb"></div>
                    <p>Sincroniza tus metas con GaiaFlow</p>
                 </div>
              )}
            </div>

            {/* DIVIDER VISUAL (Solo en modo registro y desktop) */}
            {!isLogin && <div className="book-divider"></div>}

            {/* APARTADO DERECHO: Credenciales */}
            <div className="book-page credentials-page">
              {!isLogin && <p className="section-tag">Acceso</p>}
              
              <div className="credentials-fields">
                <InputField id='login-email' label='Correo Electrónico' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <InputField id='login-password' label='Contraseña' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                {!isLogin && (
                  <InputField id='register-confirm-password' label='Confirmar Contraseña' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                )}
              </div>

              <button type='submit' disabled={loading} className='login-submit-button'>
                {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Completar Registro'}
              </button>

              <div className='login-toggle-text'>
                {isLogin ? '¿Aún no eres miembro? ' : '¿Ya tienes cuenta? '}
                <button type='button' className='login-toggle-btn' onClick={toggleMode}>
                  {isLogin ? 'Regístrate' : 'Inicia sesión'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
