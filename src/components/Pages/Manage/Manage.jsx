import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Sidebar/Sidebar';
import Tabination from '@/utils/Tabination';
import '@/styles/Manage.css';

const tabs = [
  { label: "My Posts", value: "posts" },
  { label: "Applications & Collaborations", value: "applications" },
  { label: "Saved", value: "saved" },
  { label: "History", value: "history" },
];


export default function Manage({isAuthenticated, setIsAuthenticated}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('.manage-header header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      updateHeaderHeight();
    };
    
    updateHeaderHeight();
    const timeoutId = setTimeout(updateHeaderHeight, 1);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleTabChange = (value) => {
    navigate(`/manage/${value}`);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} hasMenuButton={false} borderBottom={false}/>
      <Sidebar hasSidebar={false} />
      <div className="main">
        <div className="manage-header">
        <Tabination 
          tabs={tabs} 
          initialValue={location.pathname.split('/').pop()} 
          hideDivider={false} 
          onChange={handleTabChange}
        />
        </div>
        <div style={{ marginTop: `${headerHeight + (windowWidth > 700 ? 16 : 0)}px` }}>
          <Outlet />
        </div>
      </div>
    </>
  );
}