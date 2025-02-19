import React, { useState, useEffect, useRef } from 'react';
import { BellIcon } from "./Icons";
import '../styles/notiDropdown.css';
import Tabination from './Tabination';

const dummyNotifications = [
    {
      id: 1,
      type: 'application_accepted',
      title: 'Application Accepted',
      message: 'Your application for Software Engineer position has been accepted',
      timestamp: '2024-01-20T10:30:00',
      read: false,
      actionLabel: 'View Application'
    },
    {
      id: 2,
      type: 'application_rejected',
      title: 'Application Rejected',
      message: 'Your application for Product Manager position was not successful',
      timestamp: '2024-01-19T15:45:00',
      read: true,
      actionLabel: 'View Application'
    },
    {
      id: 3,
      type: 'new_message',
      title: 'New Message',
      message: 'John Doe sent you a message',
      timestamp: '2024-01-18T09:15:00',
      read: false,
      actionLabel: 'View Message'
    },
    {
      id: 4,
      type: 'new_applicant',
      title: 'New Applicant',
      message: 'Sarah Smith has applied to your Frontend Developer listing',
      timestamp: '2024-01-17T14:20:00',
      read: false,
      actionLabel: 'View'
    }
  ];

const NotificationItem = ({ notification }) => {
  const getIconColor = (type) => {
    switch(type) {
      case 'application_accepted': return 'green';
      case 'application_rejected': return 'red';
      case 'new_message': return 'blue';
      case 'new_applicant': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
      <div className="notification-content">
        <div className="notification-header">
          <span className="notification-title">{notification.title}</span>
          <span className="notification-time">
            {new Date(notification.timestamp).toLocaleDateString()}
          </span>
        </div>
        <p className="notification-message">{notification.message}</p>
        <button className="notification-action">{notification.actionLabel}</button>
      </div>
    </div>
  );
};

const NotificationList = ({ notifications }) => {
  if (notifications.length === 0) {
    return <div className="no-notifications">No notifications</div>;
  }

  return (
    <div className="notifications-list">
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};
  export default function NotiDropdown() {
      const [isDropDownVisible, setIsDropDownVisible] = useState(false);
      const [touchStartY, setTouchStartY] = useState(0);
      const [touchEndY, setTouchEndY] = useState(0);
      const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
      const notiRef = useRef(null);
      const dropdownRef = useRef(null);

      const toggleDropdown = () => {
          if (isDropDownVisible) {
              if (isMobile) {
                  dropdownRef.current.classList.add('closing');
                  setTimeout(() => {
                      setIsDropDownVisible(false);
                      document.body.classList.remove('drawer-open');
                  }, 300);
              } else {
                  setIsDropDownVisible(false);
                  document.body.classList.remove('drawer-open');
              }
          } else {
              setIsDropDownVisible(true);
              document.body.classList.add('drawer-open');
          }
      };

      useEffect(() => {
          if (!isDropDownVisible && dropdownRef.current) {
              dropdownRef.current.classList.remove('closing');
          }
      }, [isDropDownVisible]);

      const handleClickOutside = (event) => {
          if (
              dropdownRef.current &&
              !dropdownRef.current.contains(event.target) &&
              notiRef.current &&
              !notiRef.current.contains(event.target)
          ) {
              event.stopPropagation();
              if (!isMobile) {
                  dropdownRef.current.classList.add('closing');
                  setTimeout(() => {
                      setIsDropDownVisible(false);
                      document.body.classList.remove('drawer-open');
                  }, 300);
              } else {
                  setIsDropDownVisible(false);
                  document.body.classList.remove('drawer-open');
              }
          }
      };

      const handleTouchStart = (event) => {
          setTouchStartY(event.touches[0].clientY);
      };

      const handleTouchMove = (event) => {
          setTouchEndY(event.touches[0].clientY);
      };

      const handleTouchEnd = () => {
          if (touchStartY - touchEndY > 50) {
              // Swipe up detected, do nothing
          } else if (touchEndY - touchStartY > 50 && isMobile) {
              // Swipe down detected, close the dropdown with animation
              if (dropdownRef.current) {
                  dropdownRef.current.classList.add('closing');
              }
              setTimeout(() => {
                  setIsDropDownVisible(false);
                  document.body.classList.remove('drawer-open');
              }, 300);
          }
      };

      useEffect(() => {
          document.addEventListener('mousedown', handleClickOutside);
          return () => {
              document.removeEventListener('mousedown', handleClickOutside);
              document.body.classList.remove('drawer-open');
          };
      }, []);

      useEffect(() => {
          const handleResize = () => {
              setIsMobile(window.innerWidth <= 700);
          };

          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
      }, []);

    return (
        <>
            <div className='notification-button' ref={notiRef} onClick={toggleDropdown}>
                <BellIcon />
            </div>
            
            {isDropDownVisible && (
                <div className='notifications-dropdown' ref={dropdownRef}>
                    <div 
                        className='dropdown-header'
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        Notifications
                    </div>
                    <Tabination 
                        hideDivider={false} 
                        initialValue="1" 
                        position='relative' 
                        hoverWidth={0} 
                        tabs={[
                            {
                                label: 'All',
                                value: '1',
                                Content: () => <NotificationList notifications={dummyNotifications} />,
                            },
                            {
                                label: 'Unread',
                                value: '2',
                                Content: () => <NotificationList 
                                    notifications={dummyNotifications.filter(n => !n.read)} 
                                />,
                            },
                        ]} 
                    />
                </div>
            )}
        </>
    );
}