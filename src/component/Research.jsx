import { useState } from 'react';
import PropTypes from 'prop-types';
import HeadingText from './layer/HeadingText';
import Container from './layer/Container';
import CustomBtn from './layer/CustomBtn';
import pic from '../assets/research.png';
import { motion } from 'framer-motion';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useContent } from '../hooks/useContent';
import { useLanguage } from '../hooks/useLanguage';

const Accordion = ({ id, title, text, isOpen, onToggle, pdfs }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = async (pdfId, fileName) => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      setDownloadProgress(0);

      const downloadUrl = `${
        import.meta.env.VITE_API_URL
      }/public/download/pdf/${pdfId}`;
      console.log('Downloading from:', downloadUrl);

      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error(`Download failed with status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDownloadProgress(100);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div
      className={`${
        isOpen ? 'bg-[#E7E7E7]/60 lg:bg-transparent' : 'hover:bg-gray-300'
      }`}
    >
      <div
        className={`flex justify-between items-center p-2 sm:p-4 duration-300 cursor-pointer ${
          isOpen ? 'lg:bg-none' : 'bg-[#E7E7E7] hover:bg-gray-300'
        }`}
        onClick={() => onToggle(id)}
      >
        <h3 className="text-lg sm:text-xl md:text-[2.125rem] sm:leading-[2.375rem] font-inter font-bold">
          {isOpen
            ? title
            : title.length > 40
            ? title.substring(0, 40) + '...'
            : title}
        </h3>
        <div>
          {isOpen ? (
            <FaMinus className="text-xs sm:text-base" />
          ) : (
            <FaPlus className="text-xs sm:text-base" />
          )}
        </div>
      </div>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden px-6 py-4"
        >
          <div
            className="text-sm md:text-lg leading-7"
            dangerouslySetInnerHTML={{ __html: text }}
          />
          {pdfs && pdfs.length > 0 && (
            <div className="mt-4 space-y-3">
              {pdfs.map((pdf, index) => (
                <div key={pdf.id} className="flex flex-col">
                  {pdf.title && (
                    <h4 className="text-lg font-semibold mb-1">{pdf.title}</h4>
                  )}
                  {pdf.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {pdf.description}
                    </p>
                  )}
                  <button
                    onClick={() => handleDownload(pdf.id, pdf.fileName)}
                    disabled={isDownloading}
                    className="px-6 py-2 bg-[#008645] text-white rounded hover:bg-[#008645]/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-fit"
                  >
                    <span>
                      {isDownloading
                        ? `Downloading ${index + 1}...`
                        : `Download ${index + 1}`}
                    </span>
                  </button>
                  {isDownloading && downloadProgress > 0 && (
                    <div className="mt-2 w-full max-w-xs">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

Accordion.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  pdfs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fileName: PropTypes.string.isRequired,
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
};

const Research = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const { researchAndPublications, loading, error } = useContent();
  const { language } = useLanguage();

  const handleToggle = (id) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  // Get post title safely
  const getPostTitle = (post) => {
    if (!post?.title) return '';
    return post.title[language] || post.title.en || '';
  };

  // Get post content safely
  const getPostContent = (post) => {
    if (!post?.content) return '';
    return post.content[language] || post.content.en || '';
  };

  if (loading) {
    return (
      <div className="xl:pt-32 md:pt-24 pt-16 text-center">
        <HeadingText text="Research & Publication" />
        <div className="loading-spinner">Loading research...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="xl:pt-32 md:pt-24 pt-16 text-center">
        <HeadingText text="Research & Publication" />
        <div className="error-message">Error loading research: {error}</div>
      </div>
    );
  }

  if (
    !Array.isArray(researchAndPublications) ||
    researchAndPublications.length === 0
  ) {
    return (
      <div className="xl:pt-32 md:pt-24 pt-16 text-center">
        <HeadingText text="Research & Publication" />
        <div className="no-content">No research posts available</div>
      </div>
    );
  }

  return (
    <div className="xl:pt-32 md:pt-24 pt-16 px-3 2xl:px-0 mx-20">
      <HeadingText text="Research & Publication" />
      <Container className="flex 2xl:px-0 xl:p-0">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="leaf p-5 lg:p-0 w-full lg:w-1/2 flex flex-col xl gap-y-10 2xl:gap-y-16"
        >
          {researchAndPublications
            .map((post, index) => (
              <motion.div
                key={post._id || index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.5 + index * 0.3,
                }}
                viewport={{ once: true }}
              >
                <Accordion
                  id={post._id || String(index)}
                  title={getPostTitle(post)}
                  text={getPostContent(post)}
                  isOpen={activeAccordion === (post._id || String(index))}
                  onToggle={handleToggle}
                  pdfs={post.pdfs}
                />
              </motion.div>
            ))
            .slice(0, 4)}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.5 + researchAndPublications.length * 0.3,
            }}
            viewport={{ once: true }}
          >
            <CustomBtn
              text="View All"
              className="font-normal !bg-white/50"
              href="/research"
            />
          </motion.div>
        </motion.div>
        <motion.div className="right flex h-full w-full -z-10 lg:static lg:w-1/2 blur-[3px] lg:blur-none">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="absolute h-full w-full"
          >
            <img className="w-full h-full lg:ml-14" src={pic} alt="Research" />
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Research;
