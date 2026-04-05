/* =======================================================================================================================
          CustomDatePicker.jsx - Componente interactivo para la selección visual de fechas en formato calendario
======================================================================================================================= */
// Import base de React y hooks necesarios referenciados
import React, { useState, useEffect, useRef } from 'react'
// Import de la hoja de estilos base para este componente
import '../styles/components/CustomDatePicker.css'

// Constante con todos los nombres de los meses en español para armar el grid y el select
const MONTHS = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

// Componente funcional que recrea el select tradicional de tipo date con estilo de GymMgmt
export const CustomDatePicker = ({ id, label, placeholder, value, onChange, required = true }) => {
  // Controla la visibilidad del calendario emergente
  const [isOpen, setIsOpen] = useState(false)
  // Almacena el mes y año visualizados. Por defecto: Enero 2000
  const [currentView, setCurrentView] = useState(new Date(2000, 0, 1))
  // Referencia para detectar clics fuera del componente (Click Outside)
  const containerRef = useRef(null)

  // Alterna el calendario y sincroniza 'currentView' con la fecha preseleccionada
  const togglePicker = () => {
    if (!isOpen && value) {
      // Extrae [DD, MM, YYYY]
      const parts = value.split('/') 
      if (parts.length === 3) {
        setCurrentView(
          new Date(
            parseInt(parts[2]),
            parseInt(parts[1]) - 1,
            parseInt(parts[0])
          )
        )
      }
    }
    setIsOpen(!isOpen)
  }

  // Cierra el calendario al hacer clic fuera de su contenedor
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    
    // Solo escucha el evento mousedown si el modal está abierto para optimizar memoria
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const year = currentView.getFullYear()
  const month = currentView.getMonth()

  /* LÓGICA DEL GRID DEL CALENDARIO */
  // Calcula el último día del mes actual (Día 0 del mes siguiente)
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
  
  // Determina el primer día de la semana ajustado (Lunes = 0, Domingo = 6)
  const getFirstDayOfMonth = (y, m) => {
    let day = new Date(y, m, 1).getDay()
    return day === 0 ? 6 : day - 1
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const daysArray = []
  
  // Celdas vacías previas al día 1
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null)
  }
  
  // Días reales del mes
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i)
  }

  // Selección del día ajustando formato a DD/MM/YYYY
  const handleDaySelect = (day) => {
    if (!day) return // Ignora clics en celdas vacías
    const formatted = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`
    onChange({ target: { value: formatted } })
    setIsOpen(false)
  }

  // Navega meses adelante/atrás
  const handleMonthChange = (offset) => {
    setCurrentView(new Date(year, month + offset, 1))
  }

  const handleYearChange = (e) => {
    setCurrentView(new Date(parseInt(e.target.value), month, 1))
  }

  const handleMonthSelectChange = (e) => {
    setCurrentView(new Date(year, parseInt(e.target.value), 1))
  }

  return (
    <div
      className='input-group custom-date-picker-container'
      ref={containerRef}
    >
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type='text'
        readOnly
        placeholder={placeholder}
        value={value}
        onClick={togglePicker}
        required={required}
        className='date-picker-input'
      />

      {isOpen && (
        <div className='cal-dropdown animate-fade-up'>
          <div className='cal-card'>
            <div className='cal-header'>
              <div className='cal-selectors'>
                {/* Selector rápido del mes */}
                <select
                  value={month}
                  onChange={handleMonthSelectChange}
                  className='cal-select'
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
                {/* Input numérico rápido para el año */}
                <input
                  type='number'
                  value={year}
                  onChange={handleYearChange}
                  className='cal-year-input'
                  min='1900'
                  max='2100'
                />
              </div>
              <div className='cal-nav-btns'>
                <button
                  type='button'
                  className='cal-nav'
                  onClick={() => handleMonthChange(-1)}
                >
                  ‹
                </button>
                <button
                  type='button'
                  className='cal-nav'
                  onClick={() => handleMonthChange(1)}
                >
                  ›
                </button>
              </div>
            </div>

            {/* Cabecera de días de la semana (L a D) */}
            <div className='cal-weekdays'>
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                <div key={d} className='weekday'>
                  {d}
                </div>
              ))}
            </div>

            {/* Iteración de los días reales calculados */}
            <div className='cal-days'>
              {daysArray.map((day, index) => (
                <div
                  key={index}
                  className={`day ${!day ? 'empty' : ''}`}
                  onClick={() => handleDaySelect(day)}
                >
                  {day || ''}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
