import React from 'react';
import offerbanner from '../assets/offer_banner.png';
import Servicesbanner5 from '../assets/home-19-banner-custom-11_1920x.jpg';
import { FaShippingFast, FaTags, FaMoneyCheckAlt, FaDollarSign } from 'react-icons/fa';

const Banner = () => {
  return (
    <div className="" style={{ backgroundImage: `url(${Servicesbanner5})` }}>
      <div className=""></div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-12 max-w-7xl mx-auto text-white">
        
        <div className="p-6 rounded-lg shadow-lg text-center">
          <FaShippingFast className="text-3xl mb-4 mx-auto" />
          <strong className="text-lg">Free Shipping On First Sale</strong>
          <p className="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>

        <div className=" p-6 rounded-lg shadow-lg text-center">
          <FaTags className="text-3xl mb-4 mx-auto" />
          <strong className="text-lg">Weekly Flash Sale</strong>
          <p className="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>

        <div className=" p-6 rounded-lg shadow-lg text-center">
          <FaMoneyCheckAlt className="text-3xl mb-4 mx-auto" />
          <strong className="text-lg">CashBack Reward System</strong>
          <p className="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>

        <div className=" p-6 rounded-lg shadow-lg text-center">
          <FaDollarSign className="text-3xl mb-4 mx-auto" />
          <strong className="text-lg">Annual Payment Discount</strong>
          <p className="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>

      </div>
    </div>
  );
}

export default Banner;
