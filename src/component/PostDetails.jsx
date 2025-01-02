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
import Slider from 'react-slick';
import SliderCard from './layer/SliderCard';
import HeadingText from './layer/HeadingText';

const preprocessContent = (content) => {
  return content.replace(/class="(.*?)"/g, (match, classes) => {
    // Remove 'ql-' prefix and return updated class string
    const updatedClasses = classes
      .split(' ')
      .map((cls) => cls.replace(/^ql-/, ''))
      .join(' ');
    return `class="${updatedClasses}"`;
  });
};

const LoadingSpinner = () => (
  <Container className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </Container>
);

const SafeHTML = ({ content }) => {
  try {
    const processedContent = preprocessContent(content);

    return (
      <div
        className="prose max-w-none mb-16 flex flex-col"
        dangerouslySetInnerHTML={{
          __html: processedContent,
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Log the pdfs to check if they are being passed correctly
  console.log('PDFs:', pdfs);

  // If no PDFs are passed or the array is empty, show a fallback message
  if (!pdfs || pdfs.length === 0) return <p>No documents available.</p>;

  const handleDownload = async (pdfs) => {
    const { id, fileName } = pdfs;

    console.log(fileName);

    try {
      // Fallback to server download endpoint
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/public/download/pdf/${id}`, // Adjusted to match backend route
        {
          responseType: 'blob',
          timeout: 60000, // Increase timeout for large files
        }
      );

      if (!response.data) {
        throw new Error('No data received');
      }

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setDownloadProgress(100);
      }, 100);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Documents</h2>
      <div className="space-y-4">
        {pdfs.map((pdf) => (
          <div key={pdf.id} className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{pdf.fileName}</h3>
            <button
              onClick={() => handleDownload(pdf)}
              disabled={isDownloading}
              className="text-[#008645] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading
                ? `Downloading... ${downloadProgress}%`
                : 'Download PDF'}
            </button>
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
  const { posts, categories } = useContent();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let [active, setActive] = useState(0);

  let settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    className: 'center',
    centerMode: true,
    centerPadding: '400px',
    speed: 2000,
    autoplaySpeed: 7500,
    vertical: false,
    adaptiveHeight: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    appendDots: (dots) => (
      <div className="bg-none flex justify-center w-full">
        <ul className="flex gap-x-3 md:gap-x-5 py-5 md:py-8 mx-auto w-full justify-center">
          {dots}
        </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        className={` w-8 md:w-20 h-2 md:h-4  rounded-full text-transparent border md:border-2 ${
          active == i ? '  bg-primary ' : '  bg-primary/30 '
        } `}
      >
        {i + 1}
      </div>
    ),
    beforeChange: (a, b) => {
      setActive(b);
    },
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          dots: false,
          arrows: false,
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          centerMode: false,
        },
      },
      {
        breakpoint: 1280,
        settings: {
          dots: false,
          arrows: false,
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          className: 'center',
          centerMode: true,
          centerPadding: '80px',
        },
      },
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          className: 'center',
          centerMode: true,
          centerPadding: '80px',
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          slidesToShow: 2,
          slidesToScroll: 2,
          className: 'center',
          centerMode: true,
          centerPadding: '30px',
        },
      },
      {
        breakpoint: 763,
        settings: {
          arrows: false,
          slidesToShow: 2,
          slidesToScroll: 2,
          className: 'center',
          centerMode: true,
          centerPadding: '20px',
        },
      },
      {
        breakpoint: 414,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 3,
          className: 'center',
          centerMode: true,
          centerPadding: '20px',
        },
      },
    ],
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/public/posts/${slug}`
        );

        if (response.data.success && response.data.post) {
          const fetchedPost = response.data.post; // Adjust to match API response structure
          setPost(fetchedPost);

          const currentCategory = categories.find(
            (cat) => cat.id === fetchedPost.categoryId
          );

          const related =
            posts
              ?.filter(
                (p) =>
                  p.id !== fetchedPost.id &&
                  p.categoryId === currentCategory?.id
              )
              ?.sort(() => Math.random() - 0.5)
              ?.slice(0, 3) || [];

          setRelatedPosts(related);
          setError(null);
        } else {
          throw new Error(response.data.message || 'Post not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err.message);
        setError(err.message || 'Error fetching post');
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
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'en' ? post.titleEn : post.titleBn}
          </h1>
          <div className="text-gray-600 text-sm">
            {format(new Date(post.createdAt), 'MMMM dd, yyyy')}
          </div>
        </div>

        {/* Post Cover Image */}
        {/* {post.coverImage && (
          <div className="mb-8 flex justify-center">
            <img
              height="400"
              width="800"
              src={post.coverImage}
              alt={language === 'en' ? post.titleEn : post.titleBn}
              className="w-full h-[400px] object-contain rounded-lg"
              style={{ width: '800px', height: '400px' }}
              onError={(e) => {
                console.warn(`Failed to load image: ${post.coverImg}`);
                e.target.src = defaultImage;
              }}
            />
          </div>
        )} */}

        {/* Post Content */}
        <SafeHTML
          content={language === 'en' ? post.contentEn : post.contentBn}
        />

        {/* PDFs Display */}
        <PDFDisplay pdfs={post.pdfs} />

        {/* Related Posts */}
        <HeadingText
          className="text-2xl font-bold m-4"
          text="Related Content"
        />
      </Container>
      {/* Related Posts */}
      <Slider {...settings}>
        {relatedPosts.length > 0 &&
          relatedPosts.map((post) => (
            <div key={post.id} className="px-2 slider-container">
              <SliderCard
                className="border-none"
                image={post.coverImage}
                text={language === 'en' ? post.titleEn : post.titleBn}
                href={`/posts/${post.slug}`}
              />
            </div>
          ))}
      </Slider>
    </motion.div>
  );
};

export default PostDetails;
