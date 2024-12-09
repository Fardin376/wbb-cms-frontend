import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const CustomBtn = ({ text, className, href }) => {
  return (
    <motion.button
      whileHover={{
        boxShadow: '0px 8px 15px rgba(0, 134, 69, 0.3)',
      }}
      whileTap={{
        scale: 0.95,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className={`${className} border text-[#008645] border-[#008645] p-2.5 font-inter font-bold text-2xl leading-7 hover:!bg-[#008645] hover:text-white duration-300 `}
    >
      <Link to={href}>{text}</Link>
    </motion.button>
  );
};

CustomBtn.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  href: PropTypes.string.isRequired,
};

CustomBtn.defaultProps = {
  className: '',
};

export default CustomBtn;
