import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import Container from "./layer/Container";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MediaFooter = () => {
  const links = [
    {
      name: "Twitter",
      color: "bg-[#70C2E8]",
      icon: <FaTwitter />,
      link: "/",
    },
    {
      name: "Facebook",
      color: "bg-[#4E75B7]",
      icon: <FaFacebookF />,
      link: "/",
    },
    {
      name: "LinkedIn",
      color: "bg-[#127EBF]",
      icon: <FaLinkedinIn />,
      link: "/",
    },
    {
      name: "YouTube",
      color: "bg-[#D95F48]",
      icon: <FaYoutube />,
      link: "/",
    },
    {
      name: "Instagram",
      color: "bg-[#E4405F]",
      icon: <FaInstagram />,
      link: "/",
    },
  ];
  const listVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-[#EDF3F6] px-3">
      <Container>
        <motion.ul
          className="flex sm:justify-center sm:items-center gap-x-8 md:gap-x-11 gap-y-3 py-4 sm:py-9 px-3 flex-col sm:flex-row"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {links.map((item, index) => (
            <motion.li
              key={index}
              variants={itemVariants}
              whileHover={{
                transition: { duration: 0.3 },
              }}
            >
              <Link
                className="flex gap-x-2.5 items-center group"
                to={item.link}
              >
                <motion.div
                  className={`icon grid place-content-center w-6 h-6 rounded-full text-[#EDF3F6] ${item.color}`}
                  whileHover={{
                    rotate: 360,
                    transition: { duration: 0.6 },
                  }}
                >
                  {item.icon}
                </motion.div>
                <motion.p
                  className="group-hover:text-[#127EBF] transition-colors duration-300"
                >
                  {item.name}
                </motion.p>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </div>
  );
};

export default MediaFooter;
