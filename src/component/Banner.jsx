import React from "react";
import Slider from "react-slick";
import slider1 from "../assets/slider1.png";
import slider2 from "../assets/slider2.png";
import slider3 from "../assets/slider3.png";
import "../App.css";

const Banner = () => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    fade: true,
    autoplaySpeed: 2500,
    cssEase: "linear",
  };

  const slides = [
    { id: 1, image: slider1 },
    { id: 2, image: slider2 },
    { id: 3, image: slider3 }
  ];

  return (
    <div className="relative w-screen">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="div w-screen aspect-[1920/920]">
            <img
              className="w-full h-full object-cover object-center"
              src={slide.image}
              alt={`Slide ${slide.id}`}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
