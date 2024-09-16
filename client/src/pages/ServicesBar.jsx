import React from 'react';
import { FaTruck, FaThumbsUp, FaUndo, FaLock, FaHeadset } from 'react-icons/fa';
import banner1 from '../assets/banner-campaign-1.png';
import banner2 from '../assets/banner-campaign-2.png';

const ServicesBar = () => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 border-2 border-blue-100 p-5 bg-white shadow-md rounded-lg">
        <div className="flex items-center space-x-3">
          <FaTruck className="text-blue-500 text-3xl md:text-4xl" />
          <div>
            <p className="font-semibold text-sm md:text-base">Express Delivery</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FaThumbsUp className="text-blue-500 text-3xl md:text-4xl" />
          <div>
            <p className="font-semibold text-sm md:text-base">99% Customer</p>
            <p className="text-sm md:text-base">Feedbacks</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FaUndo className="text-blue-500 text-3xl md:text-4xl" />
          <div>
            <p className="font-semibold text-sm md:text-base">10 Days</p>
            <p className="text-sm md:text-base">For Free Return</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FaLock className="text-blue-500 text-3xl md:text-4xl" />
          <div>
            <p className="font-semibold text-sm md:text-base">Payment</p>
            <p className="text-sm md:text-base">Secure System</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FaHeadset className="text-blue-500 text-3xl md:text-4xl" />
          <div>
            <p className="font-semibold text-sm md:text-base">24/7</p>
            <p className="text-sm md:text-base">Online Supports</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row mt-10 space-y-4 sm:space-y-0 sm:space-x-4">
        <img src={banner1} alt="Banner 1" className="w-full h-auto rounded-lg shadow-md" />
        <img src={banner2} alt="Banner 2" className="w-full h-auto rounded-lg shadow-md" />
      </div>
    </>
  );
};

export default ServicesBar;
