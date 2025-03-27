import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import '../src/styles/sidebar.css'
import '../src/styles/page.css'
import './App.css'

import Login from '@/components/Pages/Auth/Login'
import Signup from '@/components/Pages/Auth/Signup'
import RegisterForm from '@/components/Forms/RegisterForm'

const Home = lazy(() => import('@/components/Pages/Home/Home'))
import About from '@/components/Pages/Home/About'
import Contact from '@/components/Pages/Home/Contact'
import Privacy from '@/components/Pages/Policies/Privacy'
import Terms from './components/Pages/Policies/Terms'

import Explore from '@/components/Pages/Explore'
import ListingDetails from '@/components/Cards/listingDetails'

import Account from '@/components/Pages/Account/Account'
import Profile from '@/components/Pages/Account/Profile'
import Inbox from '@/components/Pages/Account/Inbox'
import Settings from '@/components/Pages/Account/Settings'
import Pricing from '@/components/Pages/Account/Pricing'

import Manage from '@/components/Pages/Manage/Manage'
import Posts from '@/components/Pages/Manage/Posts'
import Applications from '@/components/Pages/Manage/Applications'
import Saved from '@/components/Pages/Manage/Saved'
import History from '@/components/Pages/Manage/History'
const Navbar = lazy(() => import('@/components/Navbar/Navbar'))
import Sidebar from '@/components/Sidebar/Sidebar'

import useWindowSize from '@/utils/windowSize'

import { Mail, Search, Info } from '@geist-ui/icons'
import { useAuthContext } from './context/AuthContext'

function App() {
  const { isAuthenticated, profile } = useAuthContext()

  const [, desktop] = useWindowSize()
  const [isOpen, setIsOpen] = useState(false)
  const sidebarRef = useRef(null)

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const sidebarLinks = [
    { icon: <Search size={20} />, label: 'Explore', path: '/explore' },
    { icon: <Info size={20} />, label: 'About', path: '/about' },
    { icon: <Mail size={20} />, label: 'Contact', path: '/contact' },
  ]

  return (
    <Router>
      <Suspense
        fallback={
          <div
            style={{
              display: 'grid',
              height: '100vh',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: '0.3',
            }}
          >
            <img src="/SponsorLinkLogo.png" width={100} />
          </div>
        }
      >
        {!isAuthenticated ? (
          <>
            <Navbar
              hasMenuButton={!desktop}
              isOpen={isOpen}
              toggleSidebar={toggleSidebar}
              hasSearchbar={false}
              setIsOpen={setIsOpen}
            />
            {!desktop && (
              <div ref={sidebarRef}>
                <Sidebar
                  links={sidebarLinks}
                  hasSidebar={true}
                  isOpen={isOpen}
                  toggleSidebar={toggleSidebar}
                />
              </div>
            )}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route
                path="*"
                element={
                  <div
                    style={{
                      height: '100vh',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    404: page not found
                  </div>
                }
              />
            </Routes>
          </>
        ) : (
          <>
            {profile.is_first_time ? (
              <RegisterForm />
            ) : (
              <Routes>
                <Route path="/" element={<Navigate to="/explore" replace />} />
                <Route path="explore" element={<Explore />} />
                <Route path="explore/details" element={<ListingDetails />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/manage/*" element={<Manage />}>
                  <Route index element={<Navigate to="posts" replace />} />
                  <Route path="posts" element={<Posts />} />
                  <Route path="applications" element={<Applications />} />
                  <Route path="saved" element={<Saved />} />
                  <Route path="saved/details" element={<ListingDetails />} />
                  <Route path="history" element={<History />} />
                  <Route path="history/details" element={<ListingDetails />} />
                </Route>
                <Route path="/account/*" element={<Account />}>
                  <Route index element={<Navigate to="profile" replace />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="inbox" element={<Inbox />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="pricing" element={<Pricing />} />
                </Route>

                <Route
                  path="*"
                  element={<div>error 404: page not found</div>}
                />
              </Routes>
            )}
          </>
        )}
      </Suspense>
    </Router>
  )
}

// Logout Component
function Logout() {
  const navigate = useNavigate()
  const { logout } = useAuthContext()

  useEffect(() => {
    logout()
  }, [])

  return null
}

export default App
