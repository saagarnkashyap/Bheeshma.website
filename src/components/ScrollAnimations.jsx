import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ScrollAnimations = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      delay: 100,
    });

    // Refresh AOS on route changes
    AOS.refresh();

    return () => {
      AOS.refresh();
    };
  }, []);

  return null;
};

export default ScrollAnimations;

