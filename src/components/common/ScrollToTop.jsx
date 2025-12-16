import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // scroll to top on first visit and every route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // change to 'smooth' if you want animation
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
