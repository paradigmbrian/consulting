import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll manager. React Router resets neither on navigation nor for hash
 * targets. On a plain navigation we jump to the top (without this, clicking a
 * card partway down one page lands you partway down the next). When the URL
 * carries a hash (e.g. the nav's "Use cases" → /#use-cases), we scroll that
 * section into view instead — retried on the next frame so it also works when
 * arriving from another page before the target has mounted.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const scrollToHash = () => {
        const el = document.getElementById(hash.slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      };
      // one frame later so a freshly-navigated page has laid out its sections
      requestAnimationFrame(scrollToHash);
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
