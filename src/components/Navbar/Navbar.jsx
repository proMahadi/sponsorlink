import '../../styles/navbar.css'
import NavbarLeft from './left'
import SearchBar from '@/utils/searchBar'
import NavbarRight from './right'
import { useLocation } from 'react-router-dom'

function Navbar({
  hasMenuButton,
  borderBottom,
  isOpen,
  setIsOpen,
  toggleSidebar,
  hasSearchbar = true,
}) {
  const location = useLocation()
  const hideNavbarPaths = []

  if (!hideNavbarPaths.includes(location.pathname)) {
    return (
      <nav
        className={`navbar glass ${
          borderBottom === false ? 'border-bottom-hidden' : ''
        }`}
      >
        <div className="navbar-div">
          <NavbarLeft
            hasMenuButton={hasMenuButton}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            toggleSidebar={toggleSidebar}
          />
          {hasSearchbar && <SearchBar />}
          <NavbarRight setIsOpen={setIsOpen} />
        </div>
      </nav>
    )
  }
}

export default Navbar
