import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TopHeader from './TopHeader';
import MainHeader from './MainHeader';
import MainHeaderSmall from './MainHeaderSmall';

const Navbar = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav>
        <motion.div transition={{ duration: 0.2, ease: 'linear' }} className="">
          <TopHeader />
        </motion.div>
        {windowWidth >= 1280 ? <MainHeader /> : <MainHeaderSmall />}
      </nav>
    </>
  );
};

export default Navbar;
