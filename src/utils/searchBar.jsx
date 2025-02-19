import React, { useEffect } from 'react';
import ifScrolled from './ifScrolled';

export default function SearchBar() {
    const scrolled = ifScrolled();

    useEffect(() => {
        const searchForm = document.querySelector('[data-js="search_form"]');
        const searchInput = document.querySelector('[data-js="search_input"]');

        const handleFocus = () => {
            searchForm.style.setProperty('--search-bg', 'white');
        };

        const handleBlur = () => {
            searchForm.style.setProperty('--search-bg', '');
        };

        searchInput.addEventListener('focus', handleFocus);
        searchInput.addEventListener('blur', handleBlur);

        return () => {
            searchInput.removeEventListener('focus', handleFocus);
            searchInput.removeEventListener('blur', handleBlur);
        };
    }, []); 

    useEffect(() => {
        const searchForm = document.querySelector('[data-js="search_form"]');
        if (scrolled) {
            searchForm.style.setProperty('--search-bg', 'rgba(255, 255, 255, 0)');
        } else {
            searchForm.style.setProperty('--search-bg', '');
        }
    }, [scrolled]);

    return (
        <form data-js="search_form" className="centre header-search">
            <input data-js="search_input" className="header-search-field" type="search" placeholder="Search"/>

            <button className="header-search-submit" aria-label="search Rumble" data-js="search_submit_button">
                <svg className="header-search-icon" viewBox="0 0 26 26">	
                    <path fill="none" strokeLinecap="round" strokeWidth="2" d="M17.6 17.6l6.3 6.3M2.2 11.2a9 9 0 1 0 18 0 9 9 0 1 0-18 0"></path>
                </svg>
            </button>   
        </form>
    );
}