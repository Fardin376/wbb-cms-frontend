import Container from './layer/Container';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { useLanguage } from '../hooks/useLanguage';

const MainFooter = () => {
  const { footerLinks, loading } = useContent();
  const { language } = useLanguage();

  console.log(footerLinks, language, loading);

  // Filter footer links by position and status
  const filteredLinksLeft = footerLinks?.filter(
    (link) => link.status === 'Published' && link.position === 'Left'
  );

  const filteredLinksCenter = footerLinks?.filter(
    (link) => link.status === 'Published' && link.position === 'Center'
  );

  const filteredLinksRight = footerLinks?.filter(
    (link) => link.status === 'Published' && link.position === 'Right'
  );

  // Fallback for 'Left' position if no links found
  const WeDoLinks = filteredLinksLeft?.length
    ? filteredLinksLeft.map((item) => ({
        text: item.name[language], // Dynamic language
        link: item.url,
      }))
    : [
        { text: 'Health Rights', link: '/' },
        { text: 'Economic & Social Justice', link: '/' },
        { text: 'Non-Communicable Diseases (NCD)', link: '/' },
        { text: 'Tobacco Control', link: '/' },
        { text: 'Healthy and Safe Travel', link: '/' },
      ];

  // Fallback for 'Center' position if no links found
  const MediaCenterLinks = filteredLinksCenter?.length
    ? filteredLinksCenter.map((item) => ({
        text: item.name[language],
        link: item.url,
      }))
    : [
        { text: 'Notice', link: '/' },
        { text: 'Photo', link: '/' },
        { text: 'Video', link: '/' },
        { text: 'WBB in news', link: '/' },
        { text: 'Link 10', link: '/' },
      ];

  // Fallback for 'Right' position if no links found
  const WBBTrustLinks = filteredLinksRight?.length
    ? filteredLinksRight.map((item) => ({
        text: item.name[language],
        link: item.url,
      }))
    : [
        { text: 'Terms and Condition', link: '/' },
        { text: 'Feedback', link: '/' },
        { text: 'Sitemap', link: '/' },
        { text: 'Web Admin', link: '/' },
        { text: 'Web Mail', link: '/' },
      ];

  const listVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        staggerChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  if (loading) {
    return <p>Loading footer links...</p>;
  }

  if (!footerLinks?.length) {
    return <p>No footer links available</p>;
  }

  return (
    <div className="bg-black py-11 md:py-[88px] px-3 2xl:px-0">
      <Container className="font-inter text-white flex justify-between px-3 xl:px-0 flex-wrap sm:flex-nowrap gap-y-16">
        {/* Left position links */}
        <motion.ul
          className="flex flex-col gap-y-5"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="font-bold text-lg left-5">What We Do</p>
          {WeDoLinks.map((item, index) => (
            <motion.li key={index} variants={itemVariants}>
              <Link
                className="hover:text-[#13FF00] duration-300"
                to={item.link}
              >
                {item.text}
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {/* Center position links */}
        <motion.ul
          className="flex flex-col gap-y-5"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="font-bold text-lg left-5">Media Center</p>
          {MediaCenterLinks.map((item, index) => (
            <motion.li key={index} variants={itemVariants}>
              <Link
                className="hover:text-[#13FF00] duration-300"
                to={item.link}
              >
                {item.text}
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {/* Right position links */}
        <motion.ul
          className="flex flex-col gap-y-5"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="font-bold text-lg left-5">WBB Trust</p>
          {WBBTrustLinks.map((item, index) => (
            <motion.li key={index} variants={itemVariants}>
              <Link
                className="hover:text-[#13FF00] duration-300"
                to={item.link}
              >
                {item.text}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </div>
  );
};

export default MainFooter;
