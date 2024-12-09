import { useState } from 'react';
import Slider from 'react-slick';
import SliderCard from './layer/SliderCard';
import HeadingText from './layer/HeadingText';
import { useContent } from '../hooks/useContent';
import { useLanguage } from '../hooks/useLanguage';

const ActivitySlider = () => {
  const { featuredPosts, loading, error } = useContent();
  const { language } = useLanguage();

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

  if (loading) {
    return (
      <div className="xl:pt-32 md:pt-24 pt-16 text-center">
        <HeadingText text="Activities" className="px-3" />
        <div className="loading-spinner">Loading featured activities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="xl:pt-32 md:pt-24 pt-16 text-center">
        <HeadingText text="Activities" className="px-3" />
        <div className="error-message">
          Error loading featured activities: {error}
        </div>
      </div>
    );
  }

  // Make sure featuredPosts is an array and has items
  if (!Array.isArray(featuredPosts) || featuredPosts.length === 0) {
    return (
      <div className="xl:pt-32 md:pt-24 pt-16 text-center">
        <HeadingText text="Featured Activities" className="px-3" />
        <div className="no-content">No featured activities available</div>
      </div>
    );
  }

  return (
    <div className="xl:pt-32 md:pt-24 pt-16 overflow-hidden slider-container">
      <HeadingText text="Activities" className="px-3" />
      <Slider {...settings}>
        {featuredPosts.map((post) => (
          <div key={post._id} className="px-2">
            <SliderCard
              className="border-none"
              image={post.coverImg}
              text={post.title?.[language] || post.title?.en || ''}
              href={`/posts/${post.slug}`}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ActivitySlider;
