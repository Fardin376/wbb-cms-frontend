import Container from './layer/Container';
import history from '/history.png';
import CustomBtn from './layer/CustomBtn';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { useLanguage } from '../hooks/useLanguage';
import PropTypes from 'prop-types';
import { useContent } from '../hooks/useContent';

const History = () => {
  const { language } = useLanguage();
  const { pages } = useContent();

  // Find the home page data
  const homePageData = pages.find(
    (page) => page.slug === 'home' || page.slug === '/home'
  );

  if (!homePageData) return null;

  // Parse and render template content
  try {
    if (homePageData?.template?.[language]?.content) {
      const rawContent =
        typeof homePageData.template[language].content !== 'string'
          ? homePageData.template[language].content
          : JSON.parse(homePageData.template[language].content);

      // Remove the template title and clean up the HTML
      let cleanHtml = rawContent.html || '';
      cleanHtml = cleanHtml.replace('Landing Page Template', '');
      // Also remove any empty lines that might be left
      cleanHtml = cleanHtml.replace(/^\s*[\r\n]/gm, '');
      const templateContent = {
        html: cleanHtml,
        css: rawContent.css || '',
      };

      return (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Container className="xl:pt-32 md:pt-16 px-3 2xl:px-0">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="history-content"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.7, ease: 'easeInOut', delay: 0.1 }}
              >
                <style>{templateContent.css}</style>
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(templateContent.html),
                  }}
                />
              </motion.div>
            </motion.div>
          </Container>
        </motion.div>
      );
    }
  } catch (err) {
    console.error('Error parsing template content:', err);
  }

  // Fallback to default layout
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Container className="xl:pt-32 md:pt-16 px-3 2xl:px-0 flex gap-y-10 items-center flex-col-reverse lg:flex-row">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="left lg:w-1/2"
        >
          <img
            src={homePageData?.historyImage || history}
            alt={homePageData?.imageAlt || 'History'}
          />
        </motion.div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeInOut', delay: 0.2 }}
          className="right lg:w-1/2 flex flex-col gap-y-4 lg:gap-y-9 lg:pl-9 pt-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.4 }}
            className="text flex flex-col gap-y-4 text-[#2B2B2B] font-inter"
          >
            <motion.h2
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
              className="font-bold font-inter text-[2rem] leading-[2.4375rem]"
            >
              {homePageData?.title || 'History and Achievements'}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="leading-8"
            >
              {homePageData?.description ||
                'Work for a Better Bangladesh (WBB) Trust was founded in December 1998...'}
            </motion.p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 1 }}
            className="link"
          >
            <CustomBtn
              text={homePageData?.buttonText || 'Details'}
              href={homePageData?.buttonLink || ''}
            />
          </motion.div>
        </motion.div>
      </Container>
    </motion.div>
  );
};

History.propTypes = {
  data: PropTypes.shape({
    template: PropTypes.shape({
      en: PropTypes.object,
      bn: PropTypes.object,
    }),
    historyImage: PropTypes.string,
    imageAlt: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    buttonText: PropTypes.string,
    buttonLink: PropTypes.string,
  }),
};

export default History;
