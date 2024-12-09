import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { format, isValid } from 'date-fns';
import { useContent } from '../../hooks/useContent';
import { useLanguage } from '../../hooks/useLanguage';
import CustomBtn from './CustomBtn';

const MediaLink = ({ itemVariants }) => {
  const { noticePosts, loading, error } = useContent();
  const { language } = useLanguage();

  // Format date safely
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isValid(date)
        ? format(date, 'do MMMM, yyyy')
        : 'Date not available';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  // Transform posts into media links
  const mediaLinks = noticePosts
    .map((post) => ({
      news: post.title[language] || post.title.en || 'Untitled',
      date: formatDate(post.createdAt),
      link: `/posts/${post.slug || post._id}`,
      _id: post._id,
    }))
    .slice(0, 4); // Limit to 4 items

  if (loading) {
    return <div className="text-white">Loading media content...</div>;
  }

  if (error) {
    return (
      <div className="text-white">Error loading media content: {error}</div>
    );
  }

  if (!Array.isArray(noticePosts) || noticePosts.length === 0) {
    return <div className="text-white">No media content available</div>;
  }

  return (
    <div className="headlines flex flex-col gap-y-8">
      {mediaLinks.map((item) => (
        <Link to={item.link} key={item._id}>
          <motion.div
            className="font-inter text-white flex flex-col gap-y-2"
            variants={itemVariants}
            whileHover={{ scale: 1.05, translateX: -10 }}
          >
            <h3 className="font-bold text-lg leading-5">{item.news}</h3>
            <p className="text-sm leading-4">{item.date}</p>
          </motion.div>
        </Link>
      ))}

      <div className="link">
        <CustomBtn
          text="View All"
          className="text-white border-white font-normal text-base py-1.5"
        />
      </div>
    </div>
  );
};

MediaLink.propTypes = {
  itemVariants: PropTypes.object,
};

export default MediaLink;
