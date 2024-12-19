import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../hooks/useLanguage';
import DOMPurify from 'dompurify';
import Container from './layer/Container';
import CustomBtn from './layer/CustomBtn';
import { motion } from 'framer-motion';
import { useContent } from '../hooks/useContent';
import PropTypes from 'prop-types';
import Home from './pages/Home';

const NotFoundPage = () => (
  // <Container className="min-h-screen flex items-center justify-center">
  //   <div className="text-center max-w-lg mx-auto px-4">
  //     <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
  //     <h2 className="text-2xl font-semibold text-gray-800 mb-4">
  //       Page Not Found
  //     </h2>
  //     <p className="text-gray-600 mb-8">
  //       The page you&apos;re looking for doesn&apos;t exist or has been moved.
  //     </p>
  //     <CustomBtn
  //       text="Back to Home"
  //       href="/"
  //       className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors"
  //     />
  //   </div>
  // </Container>
  <Home />
);

const ErrorMessage = ({ title, message }) => (
  <Container className="min-h-screen flex items-center justify-center">
    <div className="text-center max-w-lg mx-auto px-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-600 mb-8">{message}</p>
      <CustomBtn
        text="Back to Home"
        href="/"
        className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors"
      />
    </div>
  </Container>
);

const LoadingSpinner = () => (
  <Container className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-gray-600">Loading content...</p>
    </div>
  </Container>
);

const DynamicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { pages, posts, loading: contentLoading } = useContent();
  const [pageData, setPageData] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    setPageData(null);
    setRelatedPosts([]);
  }, [location.pathname]);

  useEffect(() => {
    const fetchPageAndPosts = async () => {
      try {
        if (!pages.length) return;

        // Get the path from either /pages/ or direct URL
        const fullPath = location.pathname;
        let normalizedPath;

        if (fullPath.startsWith('/pages/')) {
          normalizedPath = fullPath.split('/pages/')[1];
        } else {
          normalizedPath = fullPath.replace(/^\/+/, '');
        }

        if (!normalizedPath) {
          navigate('/', { replace: true });
          return;
        }

        normalizedPath = normalizedPath.replace(/\/+$/g, '');
        console.log('Looking for page with path:', normalizedPath);

        // Find matching page with more flexible matching
        const matchingPage = pages.find((page) => {
          const pageSlug = page.slug.replace(/^\/+|\/+$/g, '');
          return (
            pageSlug === normalizedPath ||
            `${pageSlug}` === normalizedPath ||
            page.slug === `/${normalizedPath}` ||
            page.slug === normalizedPath
          );
        });

        console.log('Matching page:', matchingPage);

        if (!matchingPage) {
          console.log(
            'No matching page found. Available pages:',
            pages.map((p) => ({ slug: p.slug, name: p.name }))
          );
          setNotFound(true);
          setError('Page not found');
          return;
        }

        // Use the matched page's slug for the API call
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/public/pages/${encodeURIComponent(matchingPage.slug)}`
        );

        if (response.data.success) {
          const fetchedPage = response.data.page;
          setPageData(fetchedPage);

          // Debug logs for related posts
          console.log('Fetched page ID:', fetchedPage._id);
          console.log('Available posts:', posts);

          // Enhanced related posts logic
          if (fetchedPage._id && posts.length > 0) {
            const pageRelatedPosts = posts.filter((post) => {
              // Debug log for each post's pages array
              console.log('Post pages array:', post.pages);

              // Check if post.pages exists and includes a page object with matching ID
              return (
                Array.isArray(post.pages) &&
                post.pages.some((page) => page._id === fetchedPage._id)
              );
            });

            console.log('Found related posts:', pageRelatedPosts);
            setRelatedPosts(pageRelatedPosts);
          } else {
            console.log('No page ID or posts available:', {
              pageId: fetchedPage._id,
              postsLength: posts.length,
            });
          }

          setError(null);
          setNotFound(false);
        }
      } catch (err) {
        console.error('Page fetch error:', err);
        setNotFound(true);
        setError(
          err.response?.status === 404 ? 'Page not found' : 'Error loading page'
        );
      } finally {
        setLoading(false);
      }
    };

    if (!contentLoading) {
      fetchPageAndPosts();
    }
  }, [
    slug,
    language,
    navigate,
    pages,
    posts,
    contentLoading,
    location.pathname,
  ]);

  if (contentLoading || (loading && !error)) {
    return <LoadingSpinner />;
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  if (error && !notFound) {
    return (
      <ErrorMessage title="Error" message={error || 'Something went wrong'} />
    );
  }

  if (!pageData?.template?.[language]?.content) {
    return (
      <ErrorMessage
        title={pageData?.name || 'Page'}
        message="Content coming soon..."
      />
    );
  }

  let templateContent;
  try {
    const rawContent = JSON.parse(pageData?.template[language]?.content);

    // Process assets first
    const assets = rawContent.assets || [];
    let processedHtml = rawContent.html || '';

    console.log('Processing template with assets:', assets);

    // Replace relative URLs with full URLs for rendering
    assets.forEach((asset) => {
      if (asset.type === 'image' && asset.src) {
        // Replace all instances of the relative URL in the HTML
        processedHtml = processedHtml.replace(
          new RegExp(asset.src, 'g'),
          asset.src
        );
      }
    });

    templateContent = {
      html: processedHtml.replace(/<title>.*?<\/title>/i, ''),
      css: rawContent.css || '',
      assets: assets,
    };

    console.log('Processed template content:', {
      assets: templateContent.assets,
      hasImages: templateContent.html.includes('<img'),
    });
  } catch (err) {
    console.error('Error parsing template content:', err);
    return <ErrorMessage title="Error" message="Error parsing page content" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="xl:pt-10 md:pt-10 px-3 2xl:px-0">
        <div
          className="page-content"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(templateContent.html),
          }}
        />

        {templateContent.css && <style>{templateContent.css}</style>}
      </Container>

      {relatedPosts.length > 0 && (
        <Container className="py-16">
          <h2 className="text-2xl font-bold mb-8">Related Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <div
                key={post._id}
                className="border p-4 rounded-lg flex flex-col justify-between"
              >
                <h3 className="font-bold mb-2">
                  {post.title[language] || post.title.en}
                </h3>
                <CustomBtn
                  text={language === 'en' ? 'Read More' : 'বিস্তারিত পড়ুন'}
                  href={`/posts/${post.slug}`}
                  className="mt-4 w-[50%]"
                />
              </div>
            ))}
          </div>
        </Container>
      )}
    </motion.div>
  );
};

ErrorMessage.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default DynamicPage;
