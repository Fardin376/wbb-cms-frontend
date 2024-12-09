import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../hooks/useLanguage';
import { useContent } from '../hooks/useContent';
import Container from './layer/Container';
import CustomBtn from './layer/CustomBtn';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import defaultImage from '../assets/default-post.jpg';
import PropTypes from 'prop-types';

const LoadingSpinner = () => (
  <Container className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </Container>
);

const SafeHTML = ({ content }) => {
  try {
    return (
      <div
        className="prose max-w-none mb-16"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    );
  } catch (error) {
    console.error('Error rendering HTML content:', error);
    return <div className="text-red-600">Error rendering content</div>;
  }
};

SafeHTML.propTypes = {
  content: PropTypes.string.isRequired,
};

const GalleryDisplay = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] overflow-hidden rounded-lg group"
          >
            <img
              src={image.imageUrl}
              alt={image.caption || `Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                console.warn(`Failed to load image: ${image.imageUrl}`);
                e.target.src = defaultImage;
              }}
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

GalleryDisplay.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      imageUrl: PropTypes.string,
      caption: PropTypes.string,
    })
  ),
};

const PDFDisplay = ({ pdfs }) => {
  if (!pdfs || pdfs.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Documents</h2>
      <div className="space-y-4">
        {pdfs.map((pdf) => (
          <div key={pdf.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{pdf.title}</h3>
            {pdf.description && (
              <p className="text-gray-600 mb-2">{pdf.description}</p>
            )}
            <a
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Download PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

PDFDisplay.propTypes = {
  pdfs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fileName: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ),
};

const PostDetails = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { posts } = useContent();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/public/posts/${encodeURIComponent(slug)}`
        );

        if (response.data.success) {
          const fetchedPost = response.data.post;
          setPost(fetchedPost);

          // Define category groups
          const categoryGroups = {
            news: ['news', 'articles'],
            articles: ['news', 'articles'],
            research: ['research', 'publications'],
            publications: ['research', 'publications'],
            others: ['others'],
          };

          // Get the group for the current post's category
          const currentCategory = fetchedPost.category?.type;
          const relatedCategories = categoryGroups[currentCategory] || [
            'others',
          ];

          // Find related posts
          const related = posts
            .filter((p) => {
              const isNotCurrentPost = p._id !== fetchedPost._id;
              const isInRelatedCategory = relatedCategories.includes(
                p.category?.type
              );

              return isNotCurrentPost && isInRelatedCategory;
            })
            .sort(() => Math.random() - 0.5) // Randomize the order
            .slice(0, 3);

          setRelatedPosts(related);
          setError(null);
        } else {
          throw new Error(response.data.message || 'Post not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug, posts]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <CustomBtn text="Back to Home" href="/" />
        </div>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <div className="error-message">Post not found</div>
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
      <Container className="xl:pt-25 md:pt-10 px-3 2xl:px-0">
        {/* Post Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {post.title?.[language] || post.title?.en}
          </h1>
          <div className="text-gray-600 text-sm">
            {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
          </div>
        </div>

        {/* Post Cover Image */}
        {post.coverImg && (
          <div className="mb-8">
            <img
              src={post.coverImg}
              alt={post.title?.[language] || post.title?.en}
              className="w-full h-[400px] object-contain rounded-lg"
              onError={(e) => {
                console.warn(`Failed to load image: ${post.coverImg}`);
                e.target.src = defaultImage;
              }}
            />
          </div>
        )}

        {/* Post Content */}
        <SafeHTML content={post.content?.[language] || post.content?.en} />

        {/* PDFs Display */}
        <PDFDisplay pdfs={post.pdfs} />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <Container className="py-2">
            <h3 className="text-2xl font-bold mb-4">Related Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost._id} className="border p-4 rounded-lg">
                  <div className="mb-4 h-24 overflow-hidden rounded-lg">
                    <img
                      src={relatedPost.coverImg || defaultImage}
                      alt={relatedPost.title[language] || relatedPost.title.en}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        console.warn(
                          `Failed to load image: ${relatedPost.coverImg}`
                        );
                        e.target.src = defaultImage;
                      }}
                    />
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    {relatedPost.title[language] || relatedPost.title.en}
                  </h3>
                  <CustomBtn
                    text="Read More"
                    href={`/posts/${relatedPost.slug}`}
                    className="mt-2 text-sm px-2"
                  />
                </div>
              ))}
            </div>
          </Container>
        )}
      </Container>
    </motion.div>
  );
};

export default PostDetails;
