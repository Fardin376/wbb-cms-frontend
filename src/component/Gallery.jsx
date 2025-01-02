import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import HeadingText from './layer/HeadingText';
import { useLanguage } from '../hooks/useLanguage';
import pageHeaderImage from '../assets/pageHeaderImg.png';
import { motion } from 'framer-motion'; // Import motion from framer-motion

const Gallery = () => {
  const location = useLocation();
  const { gallery } = useContent();
  const { language } = useLanguage();

  // Determine the current route
  const isPhotoRoute = location.pathname === '/photo';
  const isVideoRoute = location.pathname === '/video';

  // Filter items based on the current route
  const filteredItems = gallery.filter((item) =>
    isPhotoRoute
      ? item.fileType === 'image'
      : isVideoRoute
      ? item.fileType === 'video'
      : true
  );

  // Extract YouTube video ID from URL
  const extractYouTubeID = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    );
    return match ? match[1] : null;
  };

  // Render media card with motion
  const renderMediaCard = (item) => {
    if (item.fileType === 'image') {
      return (
        <motion.div
          key={item.id}
          className="media-card"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <img src={item.url} alt={item.fileName} className="media-thumbnail" />
          <p className="media-title">{item.fileName}</p>
        </motion.div>
      );
    } else if (item.fileType === 'video') {
      const videoID = extractYouTubeID(item.url);
      return (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {videoID ? (
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${videoID}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={item.fileName}
            />
          ) : (
            <p>Invalid YouTube URL</p>
          )}
          <p className="media-title">{item.fileName}</p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <>
      <style>{styles}</style>
      <img
        src={pageHeaderImage}
        alt=""
        className="absolute opacity-70 h-14 w-full"
      />

      <HeadingText
        text={`WBB Trust / ${
          isPhotoRoute
            ? language === 'bn'
              ? 'ছবি'
              : 'Photo'
            : isVideoRoute
            ? language === 'bn'
              ? 'ভিডিও'
              : 'Video'
            : null
        } ${language === 'bn' ? 'গ্যালারি' : 'Gallery'}`}
        className="mb-8 text-xl py-2 font-extrabold relative text-[#ffffff]"
      />
      <div className="gallery-container">
        {filteredItems.map((item) => renderMediaCard(item))}
      </div>
    </>
  );
};

Gallery.propTypes = {
  gallery: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      fileName: PropTypes.string,
      fileType: PropTypes.oneOf(['image', 'video']).isRequired,
    })
  ),
};

// Default styles for the gallery
const styles = `
  .gallery-container {
    display: flex;
    flex-wrap: wrap;
    padding: 1rem;
    gap: 1rem;
    justify-content: center;
  }

  .media-card {
    width: 300px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    text-align: center;
    cursor: pointer; /* Show a pointer cursor on hover */
    transition: transform 0.3s ease-in-out; /* Smooth transformation */
  }

  .media-thumbnail {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s ease-in-out; /* Smooth transformation */
}

  .media-title {
    padding: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
  }
`;

export default Gallery;
