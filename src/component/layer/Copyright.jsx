import Container from './Container';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

const Copyright = () => {
  const { language } = useLanguage();

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  return (
    <div className="bg-[#008645] px-3 2xl:px-0">
      <Container className="py-5 md:py-9 text-sm text-white leading-4 flex justify-between sm:items-center flex-col gap-y-3 sm:flex-row px-3 xl:px-0">
        <motion.p
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Link
            to=""
            className="hover:text-gray-300 transition-colors duration-300"
          >
            {language === 'en'
              ? '© 2024, Work for a Better Bangladesh (WBB) Trust, All rights reserved.'
              : '© ২০২৪, ওয়ার্ক ফর এ বেটার বাংলাদেশ (ডব্লিউবিবি) ট্রাস্ট, সর্বস্বত্ব সংরক্ষিত'}
          </Link>
        </motion.p>
        <motion.p
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Link
            to=""
            className="hover:text-gray-300 transition-colors duration-300"
          >
            {language === 'en'
              ? 'Developed by Infobase Limited'
              : 'ইনফোবেস লিমিটেড দ্বারা বিকাশিত'}
          </Link>
        </motion.p>
      </Container>
    </div>
  );
};

export default Copyright;
