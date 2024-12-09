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
        { text: 'Research .', link: '/research' },
        { text: 'Publications .', link: '/publications' },
        { text: 'Networking .', link: '/networking' },
        { text: 'Advocacy ', link: '/advocacy' },
      ],
    },
    bn: {
      title: 'পরিবর্তনের জন্য সামাজিক আন্দোলন',
      links: [
        { text: 'গবেষণা .', link: '/research' },
        { text: 'প্রকাশনা .', link: '/publications' },
        { text: 'নেটওয়ার্কিং .', link: '/networking' },
        { text: 'অ্যাডভোকেসি ', link: '/advocacy' },
      ],
    },
  };

  // Get current language content
  const currentContent = content[language] || content.en;

  return (
    <motion.div className="top bg-[#008645]">
      <Container className="flex flex-col sm:flex-row items-center justify-between py-2 sm:py-4 ">
        <motion.div
          className="text text-white font-inter"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="font-inter font-bold lg:text-xl tracking-wide">
            {currentContent.title}
          </p>
        </motion.div>
        <motion.div
          className="link flex items-center gap-x-4"
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
          <ul className="flex gap-x-1.5">
            {currentContent.links.map((item, index) => (
              <motion.li
                className={`text-xs sm:text-sm font-inter text-white relative transition-all duration-300`}
                key={index}
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link to={item.link}>{item.text}</Link>
              </motion.li>
            ))}
          </ul>

          <motion.div
            className="text-white cursor-pointer flex items-center"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <button className="text-xs sm:text-sm font-inter">
              <LangSwitcher />
            </button>
          </motion.div>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default TopHeader;
