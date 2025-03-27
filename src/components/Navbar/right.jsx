import React from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import UserMenu from '@/utils/userMenu'
import NotiDropdown from '@/utils/notiDropdown'
import { useAuthContext } from '@/context/AuthContext'

export default function NavbarRight({ setIsOpen }) {
  const navigate = useNavigate()
  const location = useLocation()

  const { isAuthenticated } = useAuthContext()

  if (isAuthenticated) {
    return (
      <div className="right">
        <div className="navigation">
          <NavLink to="/explore" className="desktop-only">
            Explore
          </NavLink>
          <NavLink to="/manage/posts" className="desktop-only">
            Manage Listings
          </NavLink>
          <div className="divider desktop-only">|</div>

          <div className="menu-buttons">
            <NotiDropdown />
            <UserMenu />
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="right ">
        <div className="navigation auth-navigation">
          {location.pathname !== '/contact' && (
            <div
              onClick={() => navigate('/contact')}
              className="auth-btn desktop-only"
            >
              Contact
            </div>
          )}
          <div onClick={() => navigate('/login')} className="auth-btn">
            Log In
          </div>
          <div onClick={() => navigate('/signup')} className="auth-btn sign">
            Sign Up
          </div>
        </div>
      </div>
    )
  }
}
