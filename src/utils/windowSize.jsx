import { useState, useEffect } from 'react';

export default function useWindowSize() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [desktop, setDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (windowWidth >= 1200) {
            setDesktop(true);
        } else {
            setDesktop(false);
        }        
    }, [windowWidth]);
    

    return [windowWidth, desktop];
}
