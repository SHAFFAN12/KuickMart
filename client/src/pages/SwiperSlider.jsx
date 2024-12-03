import React from 'react';
import Slider from 'react-slick';
import slide1 from '../assets/slider-1.jpg';
import slide2 from '../assets/slider-1.webp';
import slide3 from '../assets/slider-2.jpeg';
import '../index.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "flex", justifyContent: "center", alignItems: "center", background: "#fff", borderRadius: "50%", boxShadow: "0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%)", width: "40px", height: "40px", zIndex: 100 }}
      onClick={onClick}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5L16 12L8 19V5Z" fill="black"/>
      </svg>
    </div>
  );
};

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "flex", justifyContent: "center", alignItems: "center", background: "#fff", borderRadius: "50%", boxShadow: "0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%)", width: "40px", height: "40px", zIndex: 100 }}
      onClick={onClick}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 5L8 12L16 19V5Z" fill="black"/>
      </svg>
    </div>
  );
};

const SwiperSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />
  };

  return (
    <div className="container mt-3">
      <div className="homeBannerSection">
      <Slider {...settings}>
        <div className='item'>
          <img src={slide1} className='w-100' alt='slide1'/>
        </div>
        <div className='item'>
          <img src={slide2} className='w-100' alt='slide2'/>
        </div>
        <div className='item'>
          <img src={slide3} className='w-100' alt='slide3'/>
        </div>
        <div className='item'>
          <img src={slide1} className='w-100' alt='slide4'/>
        </div>
      </Slider>
    </div>
    </div>
  );
};

export default SwiperSlider;
