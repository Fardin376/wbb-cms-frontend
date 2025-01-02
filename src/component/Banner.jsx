import Slider from 'react-slick';
import { useContent } from '../hooks/useContent';
import { useLanguage } from '../hooks/useLanguage';
import '../App.css';

const Banner = () => {
  // Fetch banners and handle loading/error states
  const { banners, isLoading, error } = useContent();
  const { language } = useLanguage();

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    fade: true,
    autoplaySpeed: 2500,
    cssEase: 'linear',
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-screen h-[500px] flex justify-center items-center">
        Loading...
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-screen h-[500px] flex justify-center items-center">
        Error loading banners
      </div>
    );
  }

  // Handle empty banners array
  if (!banners || banners.length === 0) {
    return (
      <div className="w-screen h-[500px] flex justify-center items-center">
        No banners available
      </div>
    );
  }

  const getLocalizedText = (en, bn) => {
    return language === 'en' ? en : bn;
  };

  return (
    <div className="relative w-screen">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative w-screen h-[500px] flex justify-center items-center"
          >
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-black bg-opacity-40">
              <img src={banner.url} alt="" />
            </div>

            <div className="relative z-10 text-center text-white px-4 top-[20%] right-[20%]">
              <h2 className="text-3xl md:text-5xl font-bold transition-transform duration-500">
                {getLocalizedText(banner.titleEn, banner.titleBn)}
              </h2>
              <p className="text-sm md:text-lg mt-3 transition-opacity duration-500">
                {getLocalizedText(banner.descriptionEn, banner.descriptionBn)}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
