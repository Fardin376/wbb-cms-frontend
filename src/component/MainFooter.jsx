import Container from './layer/Container';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { useLanguage } from '../hooks/useLanguage';

const MainFooter = () => {
  const { footerLinks, loading } = useContent();
  const { language } = useLanguage();

  // Filter footer links by position and status
  const filteredLinksLeft = footerLinks?.filter(
    (link) => link.status === 'PUBLISHED' && link.position === 'LEFT'
  );

  const filteredLinksCenter = footerLinks?.filter(
    (link) => link.status === 'PUBLISHED' && link.position === 'CENTER'
  );

  const filteredLinksRight = footerLinks?.filter(
    (link) => link.status === 'PUBLISHED' && link.position === 'RIGHT'
  );

  // Fallback for 'Left' position if no links found
  const WeDoLinks = filteredLinksLeft?.length
    ? filteredLinksLeft.map((item) => ({
        text: language === 'bn' ? item.nameBn : item.nameEn, // Dynamic language
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
        text: language === 'bn' ? item.nameBn : item.nameEn,
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
        text: language === 'bn' ? item.nameBn : item.nameEn,
        link: item.url,
      }))
    : null;

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
          <p className="font-bold text-lg left-5">Our Location</p>
          {WBBTrustLinks ? (
            WBBTrustLinks.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                {item.text}
              </a>
            ))
          ) : (
            // Render iframe as fallback
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9869229996625!2d90.35823708555779!3d23.74784573389755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b53c5117c9%3A0xf8e065b9a4d1908d!2sWork%20for%20a%20Better%20Bangladesh%20Trust!5e0!3m2!1sen!2sbd!4v1735641700808!5m2!1sen!2sbd"
              width="400"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-md shadow-md"
            ></iframe>
          )}
        </motion.ul>
      </Container>
    </div>
  );
};

export default MainFooter;
