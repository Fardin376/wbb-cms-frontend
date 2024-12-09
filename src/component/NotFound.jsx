import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from './layer/Container';
import CustomBtn from './layer/CustomBtn';
import { useLanguage } from '../hooks/useLanguage';

const NotFound = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Page Not Found",
      message: "The page you're looking for doesn't exist or has been moved.",
      button: "Back to Home"
    },
    bn: {
      title: "পৃষ্ঠা পাওয়া যায়নি",
      message: "আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়েছে।",
      button: "হোমে ফিরে যান"
    }
  };

  const currentContent = content[language] || content.en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold text-primary mb-4"
          >
            404
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-4"
          >
            {currentContent.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8"
          >
            {currentContent.message}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <CustomBtn
              text={currentContent.button}
              href="/"
              className="inline-block"
            />
          </motion.div>
        </div>
      </Container>
    </motion.div>
  );
};

export default NotFound; 