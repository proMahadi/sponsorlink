import React from 'react'
import { NavLink } from 'react-router-dom'
import MenuButton from '@/utils/menuButton'
import { useAuthContext } from '@/context/AuthContext'

export default function NavbarLeft({
  hasMenuButton,
  isOpen,
  setIsOpen,
  toggleSidebar,
}) {
  const handleLogoClick = () => {
    if (isOpen) {
      setIsOpen(false)
    }
  }

  const { isAuthenticated } = useAuthContext()

  return (
    <div className="left prevent-select">
      {hasMenuButton ? (
        <MenuButton
          hasSidebar={true}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          toggleSidebar={toggleSidebar}
        />
      ) : null}
      <NavLink to="/" onClick={handleLogoClick} className="logo">
        <img src="/SponsorLinkLogo.png" alt="SponsorLink Logo" width={32} />
      </NavLink>
      {!isAuthenticated && (
        <>
          <div className="divider desktop-only">|</div>
          <div className="navigation">
            <NavLink to="/explore" className="desktop-only">
              Explore
            </NavLink>
            <NavLink to="/about" className="desktop-only">
              About
            </NavLink>
          </div>
        </>
      )}
    </div>
  )
}
