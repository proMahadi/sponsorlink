import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useWindowSize from '@/utils/windowSize';
import '@/styles/sidebar.css';
  function Sidebar({ links, children, hasSidebar, isOpen, toggleSidebar }) {
    const [windowWidth] = useWindowSize();
    const debounceTimeoutRef = useRef(null);
    const location = useLocation();
    const [isHoverOpen, setIsHoverOpen] = useState(false);

    useEffect(() => {
      document.documentElement.style.setProperty('--sidebar-sm', '88px');

      const updateActiveLink = () => {
        document.querySelectorAll('.sidebar-link').forEach(link => {
          link.classList.toggle('active', link.pathname === location.pathname);
        });
      };

      updateActiveLink();
    }, [location]);

    useEffect(() => {
      const sidebarNav = document.querySelector('.sidebar-nav');
      const sidebarLinks = document.querySelectorAll('.sidebar-link');
      const sidebarWidth = hasSidebar ? (isOpen || isHoverOpen ? 'var(--sidebar-lg)' : 'var(--sidebar-sm)') : '0';
      const sidebarDisplay = hasSidebar && (windowWidth >= 1200 || isOpen || isHoverOpen) ? 'block' : 'none';

      document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
      document.documentElement.style.setProperty('--sidebar-display', sidebarDisplay);

      if (hasSidebar) {
        sidebarNav?.classList.toggle('open', isOpen || isHoverOpen);
        setTimeout(() => {
          sidebarLinks.forEach(link => link.classList.toggle('open', isOpen || isHoverOpen));
        }, (isOpen || isHoverOpen) ? 100 : 0);
      }

      const handleMouseEnter = () => {
        if (!isOpen) {
          clearTimeout(debounceTimeoutRef.current);
          debounceTimeoutRef.current = setTimeout(() => setIsHoverOpen(true), 150);
        }
      };

      const handleMouseLeave = () => {
        if (!isOpen) {
          clearTimeout(debounceTimeoutRef.current);
          debounceTimeoutRef.current = setTimeout(() => setIsHoverOpen(false), 150);
        }
      };

      if (sidebarNav) {
        sidebarNav.addEventListener('mouseenter', handleMouseEnter);
        sidebarNav.addEventListener('mouseleave', handleMouseLeave);
      }

      return () => {
        if (sidebarNav) {
          sidebarNav.removeEventListener('mouseenter', handleMouseEnter);
          sidebarNav.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }, [isOpen, isHoverOpen, windowWidth, hasSidebar]);

    const handleLinkClick = () => {
      if (windowWidth < 768) { // Assuming 768px as the breakpoint for mobile
        toggleSidebar();
      }
    };

    return (
      <div className="sidebar glass">
        <nav className="sidebar-nav">
          {links?.map((link, index) => (
            <Link key={index} to={link.path} className="sidebar-link" onClick={handleLinkClick}>
              {link.icon}
              <div>{link.label}</div>
            </Link>
          ))}
          {links && <div className="sidebar-divider"></div>}
          {children}
        </nav>
      </div>
    );
  }

  Sidebar.propTypes = {
    links: PropTypes.array,
    children: PropTypes.node,
    hasSidebar: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool,
    toggleSidebar: PropTypes.func,
  };
export default Sidebar;