import React, { useEffect, useState } from 'react';
import Carousel1 from '../assets/carousel/carousel1.png';
import Carousel2 from '../assets/carousel/carousel2.png';
import Carousel3 from '../assets/carousel/carousel3.png';
import Background from '../assets/carousel/background.jpg';
import { useNavigate } from 'react-router-dom';

const slides = [
  { image: Carousel1, title: "Entire Big Collection", description: "SHOP WISE WITH PRICE COMPARISIONS" },
  { image: Carousel2, title: "Huge Discounts Available", description: "EXCLUSIVE OFFERS AND DEALS" },
  { image: Carousel3, title: "Best Deals of the Year", description: "DON'T MISS OUT ON THE SAVINGS" }
];

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const viewCollection = () => {
    navigate('/products'); // Use leading slash for absolute path
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div
      className="relative w-full h-[50vh] md:h-[60vh] lg:h-[80vh] bg-cover bg-center mb-[15rem]"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="absolute inset-0 bg-transparent bg-opacity-30 z-10"></div> {/* Overlay for better text visibility */}
      <div className="relative flex flex-col lg:flex-row items-center lg:justify-center lg:px-[15rem] z-20">
        <div className="lg:w-[30rem] max-lg:w-[12rem] h-auto flex items-center justify-center">
          {/* Carousel Slide */}
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full rounded-lg transition-transform duration-500"
          />
        </div>
        <div className="flex flex-col items-center justify-center text-center m-5 z-20">
          <p className="text-blue-400 text-lg md:text-xl">{slides[currentSlide].title}</p>
          <p className="text-black text-xl md:text-2xl font-semibold">{slides[currentSlide].description}</p>
          <button onClick={viewCollection} className="bg-transparent border-blue-400 border-2 p-3 px-4 mt-4 text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition duration-300 z-20">
            View Collections
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
