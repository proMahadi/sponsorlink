import React, { useState, useEffect, useCallback } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  SettingsIcon,
  UserIcon,
  ShieldIcon,
  AwardIcon,
  BellIcon,
} from '@/utils/Icons'
import { Inbox } from '@geist-ui/icons'
import Navbar from '@/components/Navbar/Navbar'
import Sidebar from '@/components/Sidebar/Sidebar'
import '@/styles/Account.css'

export default function Account() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setIsOpen(window.innerWidth > 1200)
    setHasMounted(true)

    setTimeout(() => {
      setIsOpen(window.innerWidth > 1200)
    }, 100)

    const handleResize = () => {
      setIsOpen(window.innerWidth > 1200)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const sidebarLinks = [
    { icon: <Inbox />, label: 'Inbox', path: '/account/inbox' },
    { icon: <UserIcon />, label: 'Profile', path: '/account/profile' },
    { icon: <SettingsIcon />, label: 'Settings', path: '/account/settings' },
    { icon: <AwardIcon />, label: 'Pricing', path: '/account/pricing' },
  ]

  if (!hasMounted) {
    return null
  }

  return (
    <>
      <Navbar
        hasMenuButton={true}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toggleSidebar={toggleSidebar}
        hasSearchbar={false}
      />
      <div className="main">
        <Sidebar
          links={sidebarLinks}
          hasSidebar={true}
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="account-content">
          <Outlet />
        </div>
      </div>
    </>
  )
}
