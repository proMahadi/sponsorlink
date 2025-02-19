import { useLocation } from 'react-router-dom';

function usePageName() {
  const location = useLocation();
  const pathname = location.pathname;

  // Extract the last part of the pathname
  const lastPart = pathname.split('/').pop();

  // Capitalize the first letter
  const capitalizedLastPart = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);

  return capitalizedLastPart;
}

export default usePageName;