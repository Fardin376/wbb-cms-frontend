import Container from './layer/Container';
import MediaSlider from './layer/MediaSlider';
import { motion } from 'framer-motion';
import MediaLink from './layer/MediaLink';
import HeadingText from './layer/HeadingText';
import { useContent } from '../hooks/useContent';

const Media = () => {
  const { loading } = useContent();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
        delayChildren: 0.5,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: 'liner',
        type: 'spring',
        stiffness: 200,
      },
    },
  };

  if (loading) {
    return null; // Or a loading spinner if you prefer
  }

  return (
    <div className="media-bg mt-80 mb-20 py-5 px-3 2xl:px-0">
      <Container className="xl:px-0 py-14 flex flex-col lg:flex-row">
        <motion.div
          className="left w-full lg:w-1/2 aspect-[9/10] sm:aspect-video lg:aspect-auto relative"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="w-72 sm:w-[466px] aspect-[466/552] absolute top-0 -translate-y-1/3">
            <MediaSlider />
          </div>
        </motion.div>
        <motion.div
          className="right w-full lg:w-1/2 flex flex-col gap-y-10 text-right"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="text flex flex-col gap-y-5"
            variants={headerVariants}
          >
            <HeadingText text="Media Center" className="text-white" />
          </motion.div>

          <MediaLink itemVariants={itemVariants} />

          
        </motion.div>
      </Container>
    </div>
  );
};

export default Media;
