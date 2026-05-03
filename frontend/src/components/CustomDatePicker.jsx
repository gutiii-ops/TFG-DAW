import React, { useState, useEffect, useRef } from 'react'
import '../styles/components/CustomDatePicker.css'

const MONTHS = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export const CustomDatePicker = ({ id, label, placeholder, value, onChange, required = true }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentView, setCurrentView] = useState(new Date(2000, 0, 1))
  const containerRef = useRef(null)

  const togglePicker = () => {
    if (!isOpen && value) {
      const parts = value.split('/') 
      if (parts.length === 3) {
        setCurrentView(new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])))
      }
    }
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const year = currentView.getFullYear()
  const month = currentView.getMonth()

  const handleDaySelect = (day) => {
    if (!day) return
    const formatted = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`
    onChange({ target: { value: formatted } })
    setIsOpen(false)
  }

  const handleMonthChange = (offset) => {
    setCurrentView(new Date(year, month + offset, 1))
  }

  const handleYearChange = (e) => {
    setCurrentView(new Date(parseInt(e.target.value), month, 1))
  }

  const handleMonthSelectChange = (e) => {
    setCurrentView(new Date(year, parseInt(e.target.value), 1))
  }

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
  const getFirstDayOfMonth = (y, m) => {
    let day = new Date(y, m, 1).getDay()
    return day === 0 ? 6 : day - 1
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const daysArray = []
  for (let i = 0; i < firstDay; i++) daysArray.push(null)
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i)

  return (
    <div className={`floating-input-group ${value ? 'has-value' : ''}`} ref={containerRef}>
      <input
        id={id}
        type='text'
        readOnly
        placeholder={placeholder || " "}
        value={value}
        onClick={togglePicker}
        required={required}
        className='date-picker-input'
      />
      <label htmlFor={id}>{label}</label>

      {isOpen && (
        <div className='cal-dropdown animate-fade-up'>
          <div className='cal-card'>
            <div className='cal-header'>
              <div className='cal-selectors'>
                <select value={month} onChange={handleMonthSelectChange} className='cal-select'>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>{m}</option>
                  ))}
                </select>
                <input type='number' value={year} onChange={handleYearChange} className='cal-year-input' min='1900' max='2100' />
              </div>
              <div className='cal-nav-btns'>
                <button type='button' className='cal-nav' onClick={() => handleMonthChange(-1)}>‹</button>
                <button type='button' className='cal-nav' onClick={() => handleMonthChange(1)}>›</button>
              </div>
            </div>
            <div className='cal-weekdays'>
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
                <div key={d} className='weekday'>{d}</div>
              ))}
            </div>
            <div className='cal-days'>
              {daysArray.map((day, index) => (
                <div key={index} className={`day ${!day ? 'empty' : ''}`} onClick={() => handleDaySelect(day)}>
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
