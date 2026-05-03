/* =======================================================================================================================
          UserReservations.jsx - Componente funcional para el listado de reservas y calendario interactivo
======================================================================================================================= */
import React from 'react'
import '../../styles/components/user/UserReservations.css'

export const UserReservations = ({ reservations, calendarDays }) => {
  return (
    <section className='tab-content reservations-content'>
      <div className='reservations-layout'>
        {/* Lado izquierdo: Calendario de entrenamientos */}
        <div className='calendar-section'>
          <h2>Calendario</h2>
          <div className='calendar'>
            <div className='calendar-header'>
              <h3>Abril 2026</h3>
            </div>
            <div className='calendar-weekdays'>
              <div className='weekday'>Lun</div>
              <div className='weekday'>Mar</div>
              <div className='weekday'>Mié</div>
              <div className='weekday'>Jue</div>
              <div className='weekday'>Vie</div>
              <div className='weekday'>Sá</div>
              <div className='weekday'>Dom</div>
            </div>
            <div className='calendar-days'>
              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`calendar-day ${day ? '' : 'empty'} ${
                    reservations.some(
                      (r) => r.date === `2026-04-${String(day).padStart(2, '0')}`
                    )
                      ? 'has-reservation'
                      : ''
                  }`}
                >
                  {day && <span>{day}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lado derecho: Lista detallada de reservas */}
        <div className='reservations-list-section'>
          <h2>Próximas Reservas</h2>
          <div className='reservations-list'>
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className={`reservation-item status-${reservation.status}`}
                >
                  <div className='reservation-date'>
                    <span className='date-day'>
                      {new Date(reservation.date).getDate()}
                    </span>
                    <span className='date-month'>
                      {new Date(reservation.date).toLocaleDateString('es-ES', {
                        month: 'short'
                      })}
                    </span>
                  </div>
                  <div className='reservation-info'>
                    <h4>{reservation.class}</h4>
                    <p className='time'>⏰ {reservation.time}</p>
                    <p className='coach'>👨‍🏫 {reservation.coach}</p>
                  </div>
                  <div className='reservation-status'>
                    <span className={`status-badge status-${reservation.status}`}>
                      {reservation.status === 'confirmed'
                        ? 'Confirmada'
                        : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className='empty-message'>
                No tienes reservas. ¡Haz una nueva reserva!
              </p>
            )}
          </div>
          <button className='btn-new-reservation'>+ Nueva Reserva</button>
        </div>
      </div>
    </section>
  )
}
