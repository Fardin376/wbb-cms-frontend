import { motion } from 'framer-motion';
import Container from './layer/Container';
import { Link } from 'react-router-dom';
import LangSwitcher from './LangSwitcher';
import { useLanguage } from '../hooks/useLanguage';

const TopHeader = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'Change Needs Social Movement',
      links: [
        { text: 'Research', link: '/research' },
        { text: 'Publications', link: '/publications' },
        { text: 'Networking', link: '/networking' },
        { text: 'Advocacy', link: '/advocacy' },
      ],
    },
    bn: {
      title: 'পরিবর্তনের জন্য সামাজিক আন্দোলন',
      links: [
        { text: 'গবেষণা', link: '/research' },
        { text: 'প্রকাশনা', link: '/publications' },
        { text: 'নেটওয়ার্কিং', link: '/networking' },
        { text: 'অ্যাডভোকেসি', link: '/advocacy' },
      ],
    },
  };

  // Get current language content
  const currentContent = content[language] || content.en;

  return (
    <motion.div className="top bg-[#008645]">
      <Container className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 px-4 sm:px-8">
        {/* Title */}
        <motion.div
          className="text-center sm:text-left text-white font-inter"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="font-bold text-lg sm:text-xl tracking-wide leading-snug">
            {currentContent.title}
          </p>
        </motion.div>

        {/* Links and Language Switcher */}
        <motion.div
          className="link flex flex-col sm:flex-row items-center gap-4 mt-3 sm:mt-0"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delay: 1,
                staggerChildren: 0.4,
                delayChildren: 0.4,
              },
            },
          }}
        >
          {/* Navigation Links */}
          <ul className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4">
            {currentContent.links.map((item, index) => (
              <motion.li
                className="text-xs sm:text-sm font-inter text-white relative transition-all duration-300"
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  to={item.link}
                  className="hover:text-gray-200"
                  aria-label={item.text}
                >
                  {item.text}
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Language Switcher */}
          <motion.div
            className="text-white flex items-center justify-center"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <button
              className="text-xs sm:text-sm font-inter bg-white text-[#008645] px-3 py-1 rounded-md shadow-md hover:bg-gray-100 transition-all duration-300"
              aria-label="Switch Language"
            >
              <LangSwitcher />
            </button>
          </motion.div>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default TopHeader;
