import React from 'react';
import Container from './layer/Container';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MainFooter = () => {
  // Links object for paths
  const WeDoLinks = [
    { text: 'Health Rights', link: '/' },
    { text: 'Economic & Social Justice', link: '/' },
    { text: 'Non-Communicable Diseases (NCD)', link: '/' },
    { text: 'Tobacco Control', link: '/' },
    { text: 'Healthy and Safe Travel', link: '/' },
  ];

  const MediaCenterLinks = [
    { text: 'Notice', link: '/' },
    { text: 'Photo', link: '/' },
    { text: 'Video', link: '/' },
    { text: 'WBB in news', link: '/' },
    { text: 'Link 10', link: '/' },
  ];

  const WBBTrustLinks = [
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

  return (
    <div className="bg-black py-11 md:py-[88px] px-3 2xl:px-0">
      <Container className="font-inter text-white flex justify-between px-3 xl:px-0 flex-wrap sm:flex-nowrap gap-y-16">
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
