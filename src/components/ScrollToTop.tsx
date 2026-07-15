import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router does not reset scroll on navigation. Without this, clicking a
 * card partway down the index page lands you partway down the next page.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
