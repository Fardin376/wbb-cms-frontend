import Slider from 'react-slick';
import SliderCard from './SliderCard';
import HeadingText from './HeadingText';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import PropTypes from 'prop-types';
import { useContent } from '../../hooks/useContent';
import { useLanguage } from '../../hooks/useLanguage';

function SampleNextArrow({ className, onClick }) {
  return (
    <div
      className={`absolute bottom-full right-0 -translate-y-full text-primary  ${className}`}
      onClick={onClick}
    >
      <FaArrowRightLong className="text-3xl text-[#008645]" />
    </div>
  );
}

function SamplePrevArrow({ className, onClick }) {
  return (
    <div
      className={`absolute bottom-full right-6 -translate-x-full -translate-y-full text-primary ${className}`}
      onClick={onClick}
    >
      <FaArrowLeftLong className="text-3xl text-[#008645]" />
    </div>
  );
}

SampleNextArrow.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

SamplePrevArrow.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

const MediaSlider = () => {
  const { articlePosts, loading, error } = useContent();
  const { language } = useLanguage();

  // Get post title based on language
  const getPostTitle = (post) => {
    if (!post?.titleEn || !post?.titleBn) return '';
    return language === 'bn' ? post.titleBn : post.titleEn;
  };

  let settings = {
    dots: false,
    arrows: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 7500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: false,
    adaptiveHeight: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          dots: false,
        },
      },
    ],
  };

  // Loading state
  if (loading) {
    return (
      <div className="slider-container">
        <HeadingText text="Articles & News" className="py-6 px-0 sm:px-3" />
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
          <div className="loading-spinner text-primary">
            Loading articles...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="slider-container">
        <HeadingText text="Articles & News" className="py-6 px-0 sm:px-3" />
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
          <div className="error-message text-red-500">
            Error loading articles: {error}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!Array.isArray(articlePosts) || articlePosts.length === 0) {
    return (
      <div className="slider-container">
        <HeadingText text="Articles & News" className="py-6 px-0 sm:px-3" />
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
          <div className="text-white/80 mt-2">No articles available</div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="slider-container ">
      <HeadingText text="Articles & News" className="py-6 px-0 sm:px-3" />
      <Slider {...settings}>
        {articlePosts.map((item, index) => (
          <div key={item._id || index}>
            <SliderCard
              className="border-none w-[100vw] sm:w-auto h-[100%]"
              image={item.coverImg}
              text={getPostTitle(item)}
              href={`/posts/${item.slug}`}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MediaSlider;
