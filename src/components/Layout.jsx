import { Link, useLocation } from 'react-router-dom'

function Layout({ children }) {
  const location = useLocation()

  return (
    <>
      <header>
        <nav>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Дневник
          </Link>
          <Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>
            История
          </Link>
          <Link to="/products" className={location.pathname.startsWith('/products') ? 'active' : ''}>
            Продукты
          </Link>
          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
            Профиль
          </Link>
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default Layout
