import React, { useState, useEffect, useRef } from 'react'
import '../styles/userMenu.css'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { UserIcon, SettingsIcon } from './Icons'
import { Inbox, LogOut } from '@geist-ui/icons'
import { useAuthContext } from '@/context/AuthContext'

export default function UserMenu() {
  const navigate = useNavigate()

  const [menuVisible, setMenuVisible] = useState(false)
  const menuRef = useRef(null)
  const profileRef = useRef(null)
  const [newNotis, setNewNotis] = useState(true)
  const [hasMessages, setHasMessages] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/account/inbox') {
      setNewNotis(false)
      sessionStorage.setItem('newNotis', 'false')
    }
    setMenuVisible(false)
  }, [location.pathname])

  useEffect(() => {
    const newNotis = sessionStorage.getItem('newNotis')
    if (newNotis === 'false') {
      setNewNotis(false)
    }
    const applications = JSON.parse(
      localStorage.getItem('applications') || '[]'
    )
    setHasMessages(
      applications.some(
        (app) => app.status === 'accepted' || app.status === 'rejected'
      )
    )
  }, [])

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setMenuVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const { user, logout, profile } = useAuthContext()

  return (
    <div className="profile-icon-container">
      <div className="profile" ref={profileRef} onClick={toggleMenu}>
        <img
          src={profile.profile_image ?? '/default_profile_image.jpg'}
          className="profile-image"
        />
      </div>
      {menuVisible && (
        <div className="user-menu" ref={menuRef}>
          <div className="user-identity">
            <div className="user-name">{user.username}</div>
            <div className="user-email">{user.email}</div>
          </div>

          <div className="menu-divider mobile-only"></div>

          <div className="user-menu-links mobile-only">
            <NavLink className="user-menu-link" to="/explore">
              Explore
            </NavLink>
            <NavLink className="user-menu-link" to="/manage/posts">
              Manage Listings
            </NavLink>
          </div>

          <div className="menu-divider"></div>

          <div className="user-menu-links">
            <NavLink
              className={`user-menu-link ${
                newNotis && hasMessages ? 'new-notis' : ''
              }`}
              to="/account/inbox"
            >
              My Inbox
              <Inbox
                size={20}
                strokeWidth={newNotis && hasMessages ? '2' : '1.5'}
              />
            </NavLink>
            <NavLink className="user-menu-link" to="/account/profile">
              View Profile
              <UserIcon width={20} height={20} />
            </NavLink>
            <NavLink className="user-menu-link" to="/account/settings">
              Settings
              <SettingsIcon width={20} height={20} />
            </NavLink>
          </div>

          <div className="menu-divider"></div>

          <button
            className="user-menu-link"
            style={{ width: '100%', border: 'none' }}
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            Logout
            <LogOut size={20} />
          </button>

          <div className="menu-divider"></div>

          <NavLink className="upgrade-btn" to="/account/pricing">
            Upgrade to Pro
          </NavLink>
        </div>
      )}
    </div>
  )
}
