import React from 'react';
import { FaMapMarkerAlt, FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Footer = () => {
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewOnMap = () => {
    Swal.fire({
      title: 'View Location',
      text: 'Main Ma Jinnah Road, Karachi, Pakistan',
      icon: 'info',
      confirmButtonText: 'Close',
      footer: '<a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>'
    });
  };

  const handleContactSupport = () => {
    Swal.fire({
      title: 'Contact Support',
      text: 'Please reach out to us via the available channels.',
      icon: 'info',
      confirmButtonText: 'Close'
    });
  };

  return (
    <div className="bg-gray-100 text-gray-700 shadow p-8">
      <div className="text-center mb-8">
        <p className="text-3xl font-semibold text-gray-800">SHOPSPHERE<span className="text-blue-500">.</span></p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Contact Information */}
        <div className="space-y-4">
          <p className="text-xl font-semibold">Got a Question? Call us 24/7</p>
          <strong className="text-blue-500 text-xl">+92313346789</strong>
          <p className="text-gray-500"><FaMapMarkerAlt className="inline-block mr-2" /> Main Ma Jinnah Road, Karachi, Pakistan</p>
          <button 
            onClick={handleViewOnMap}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2">
            <FaMapMarkerAlt />
            <span>View On Map</span>
          </button>
        </div>

        {/* Payment and Social Links */}
        <div className="space-y-4">
          <p className="text-xl font-semibold">We Accept</p>
          <p className="text-gray-500">Safe Payments</p>
          <div className="flex space-x-4">
            <span className="bg-gray-200 text-gray-700 p-2 rounded">Skrill</span>
            <span className="bg-gray-200 text-gray-700 p-2 rounded">PayPal</span>
            <span className="bg-gray-200 text-gray-700 p-2 rounded">Union Pay</span>
          </div>
          <p className="text-xl font-semibold mt-6">Follow Us</p>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-500"><FaFacebook size={24} /></a>
            <a href="#" className="text-pink-500"><FaInstagram size={24} /></a>
            <a href="#" className="text-green-500"><FaWhatsapp size={24} /></a>
            <a href="#" className="text-red-500"><FaEnvelope size={24} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <strong className="text-xl font-semibold">Quick Links</strong>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-500 hover:text-blue-500" onClick={handleContactSupport}>Support Center</a></li>
            <li><a href="#" className="text-gray-500 hover:text-blue-500">Terms & Conditions</a></li>
            <li><a href="#" className="text-gray-500 hover:text-blue-500">Shipping</a></li>
            <li><a href="#" className="text-gray-500 hover:text-blue-500">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-500 hover:text-blue-500">Help</a></li>
            <li><a href="#" className="text-gray-500 hover:text-blue-500">Products Return</a></li>
            <li><a href="#" className="text-gray-500 hover:text-blue-500">FAQs</a></li>
          </ul>
        </div>

        {/* Store Locations */}
        <div className="space-y-4">
          <strong className="text-xl font-semibold">Our Stores</strong>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-500 hover:text-blue-500">Pakistan</a></li>
            <li><a href="#" className="text-gray-500 hover:text-blue-500">New York</a></li>
            <li><a href="#" className="text-gray-500 hover:text-blue-500">London</a></li>
          </ul>
        </div>

      </div>

      {/* Back to Top Button */}
      <div className="text-center mt-12">
        <button 
          onClick={scrollToTop}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 mx-auto">
          <FaArrowUp />
          <span>Back to top</span>
        </button>
      </div>

      <div className="text-center mt-8 text-gray-500">
        &copy; 2024 SHOPSPHERE. All rights reserved. Designed by SuperSonic Themes.
      </div>
    </div>
  );
};

export default Footer;
