import React from "react";
import Container from "./Container";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Copyright = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
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
            © 2024, Work for a Better Bangladesh (WBB) Trust, All rights
            reserved.
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
            Developed by Infobase Limited
          </Link>
        </motion.p>
      </Container>
    </div>
  );
};

export default Copyright;
