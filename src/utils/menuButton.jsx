import React, { useEffect } from 'react';
import useWindowSize from './windowSize';

export default function MenuButton({ hasSidebar, isOpen, setIsOpen, toggleSidebar }) {
  const [, desktop] = useWindowSize();

  useEffect(() => {
    if (!desktop) {
      setIsOpen(false);
    }
  }, [desktop]);

  return (
    <svg onClick={toggleSidebar} className="main-menu-open" width="24" height="24">
      <path d="M1 4h22M1 12h22M1 20h22"></path>
    </svg>
  );
}
