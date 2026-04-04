/* ============================================================================
                                loginPopup.js
      Manejador de eventos para abrir el modal de login desde el navbar
============================================================================ */

export function initLoginPopup() {
  // Obtener el botón de login del navbar
  const loginButton = document.querySelector('.nav-cta')

  if (loginButton) {
    loginButton.addEventListener('click', (event) => {
      event.preventDefault()

      // Crear y disparar un evento customizado
      const loginEvent = new CustomEvent('openLoginModal', {
        detail: { timestamp: new Date() },
        bubbles: true,
        cancelable: true
      })

      console.log(
        'Disparando evento customizado "openLoginModal" desde loginPopup.js:',
      );
      document.dispatchEvent(loginEvent)
    })
  } else {
    console.warn('No se encontró el botón de login en el navbar. Asegúrate de que exista un elemento con la clase "nav-cta".')
  }
}
