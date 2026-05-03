import React from 'react'
import { Navbar } from '../../components/navbar.jsx'
import { Footer } from '../../components/footer.jsx'
import Store from '../../components/store/Store.jsx'

const StorePage = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Store />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  )
}

export default StorePage
