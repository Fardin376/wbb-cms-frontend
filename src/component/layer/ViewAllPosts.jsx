import { motion } from 'framer-motion';
import { useContent } from '../../hooks/useContent';
import { useLanguage } from '../../hooks/useLanguage';
import Container from './Container';
import HeadingText from './HeadingText';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import defaultImage from '../../assets/default-post.jpg';
import pageHeaderImage from '../../assets/pageHeaderImg.png';

const ViewAllPosts = ({ category, titleEn, titleBn }) => {
  const { noticePosts, articlePosts, researchPosts, loading, error } =
    useContent();
  const { language } = useLanguage();

  // Select posts based on category
  const posts =
    category === 'notice'
      ? noticePosts
      : category === 'article'
      ? articlePosts
      : category === 'research'
      ? researchPosts
      : [];

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'do MMMM, yyyy');
    } catch {
      return 'Date unavailable';
    }
  };

  if (loading) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          Error loading posts: {error}
        </div>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={pageHeaderImage}
        alt=""
        className="absolute opacity-70 h-14 w-full"
      />

      <HeadingText
        text={`WBB Trust / ${language === 'bn' ? titleBn : titleEn}`}
        className="mb-8 text-xl py-2 font-extrabold relative text-[#ffffff]"
      />
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link to={`/posts/${post.slug}`}>
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={post.coverImage || defaultImage}
                    alt={language === 'bn' ? post.titleBn : post.titleEn}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                </div>

                <div className="p-4 flex flex-col ">
                  <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
                    {language === 'bn' ? post.titleBn : post.titleEn}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4">
                    {formatDate(post.createdAt)}
                  </p>

                  {post.excerpt && (
                    <p className="text-gray-600 line-clamp-3">
                      {post.excerpt[language] || post.excerpt.en}
                    </p>
                  )}

                  <div className="mt-4 text-[#008645] font-semibold hover:text-[#008645]/80 transition-colors">
                    {language === 'en' ? 'Read More' : 'বিস্তারিত পড়ুন'} →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No posts available in this category
          </div>
        )}
      </Container>
    </motion.div>
  );
};

ViewAllPosts.propTypes = {
  category: PropTypes.oneOf(['notice', 'article', 'research']).isRequired,
  titleEn: PropTypes.string.isRequired,
  titleBn: PropTypes.string.isRequired,
};

export default ViewAllPosts;
