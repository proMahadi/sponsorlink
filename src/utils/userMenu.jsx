import React, { useState, useEffect, useRef } from 'react';
import '../styles/userMenu.css';
import { NavLink, useLocation } from 'react-router-dom';
import { UserIcon, SettingsIcon } from './Icons';
import { Inbox, LogOut } from '@geist-ui/icons'


export default function UserMenu() {
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);
    const profileRef = useRef(null);
    const [newNotis, setNewNotis] = useState(true);
    const [hasMessages, setHasMessages] = useState(false);
    const location = useLocation();
    const [profileImage, setProfileImage] = useState("");
    const [profileImageLoaded, setProfileImageLoaded] = useState(false);
    
    useEffect(() => {
        const user = sessionStorage.getItem("user");
        if (user) {
            const parsedData = JSON.parse(user);
            if (parsedData.profile_image) {
                setProfileImage(parsedData.profile_image);
                setProfileImageLoaded(true);
            } else {
                setProfileImage("/default_profile_image.jpg");
                setProfileImageLoaded(true);
            }
        }
    }, []);    

    useEffect(() => {
        if (location.pathname === '/account/inbox') {
            setNewNotis(false);
            sessionStorage.setItem('newNotis', 'false');
        }
        setMenuVisible(false);
    }, [location.pathname]);

    useEffect(() => {
        const newNotis = sessionStorage.getItem('newNotis');
        if (newNotis === 'false') {
            setNewNotis(false);
        }
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        setHasMessages(applications.some(app => app.status === 'accepted' || app.status === 'rejected'));

    }, []);
    

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const handleClickOutside = (event) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target) &&
            profileRef.current &&
            !profileRef.current.contains(event.target)
        ) {
            setMenuVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="profile-icon-container">
            <div className="profile" ref={profileRef} onClick={toggleMenu}>
                {
                    profileImageLoaded ? (
                        <img
                            src={profileImage}
                            className="profile-image"
                           
                        />
                    ) : (
                        <div className='profile-image'></div>
                    )
                }
            </div>
            {menuVisible && (
                <div className="user-menu" ref={menuRef}>
                    <div className='user-identity'>
                        <div className='user-name'>Charlie McGuire</div>
                        <div className='user-email'>charliemcguirex5@gmail.com</div>
                    </div>

                    <div className='menu-divider mobile-only'></div>

                    <div className='user-menu-links mobile-only'>
                        <NavLink className='user-menu-link' to="/explore">Explore</NavLink>
                        <NavLink className='user-menu-link' to="/manage/posts">Manage Listings</NavLink>
                    </div>

                    <div className='menu-divider'></div>

                    <div className='user-menu-links'>
                        <NavLink className={`user-menu-link ${newNotis && hasMessages ? 'new-notis' : ''}`} to="/account/inbox">My Inbox
                            <Inbox size={20} strokeWidth={newNotis && hasMessages ? '2' : '1.5'} />        
                        </NavLink>
                        <NavLink className='user-menu-link' to="/account/profile">View Profile
                            <UserIcon width={20} height={20} />
                        </NavLink>
                        <NavLink className='user-menu-link' to="/account/settings">Settings
                            <SettingsIcon width={20} height={20} />
                        </NavLink>
                    </div>

                    <div className='menu-divider'></div>
                    
                    <NavLink className='user-menu-link' to="/logout">Logout
                        <LogOut size={20} />
                    </NavLink>
                        

                    <div className='menu-divider'></div>

                    <NavLink className='upgrade-btn' to="/account/pricing">Upgrade to Pro</NavLink>
                </div>
            )}
        </div>
    );
}