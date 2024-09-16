import React from 'react';
import { FaStore, FaUsers, FaHandshake, FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* About Us Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">About SHOPSPHERE</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Welcome to SHOPSPHERE, your one-stop destination for all your shopping needs in Karachi, Pakistan. 
            We are dedicated to providing you with the best shopping experience possible, with a focus on quality, 
            customer service, and reliability.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaStore className="text-5xl text-indigo-500 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800">Our Store</h3>
            <p className="text-gray-600 mt-2">
              Located in the heart of Karachi, SHOPSPHERE offers a wide range of products, from electronics to fashion, all under one roof.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaUsers className="text-5xl text-indigo-500 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800">Our Team</h3>
            <p className="text-gray-600 mt-2">
              Our dedicated team works tirelessly to bring you the latest and best products, ensuring your shopping experience is seamless.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaHandshake className="text-5xl text-indigo-500 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800">Our Commitment</h3>
            <p className="text-gray-600 mt-2">
              We are committed to offering quality products at competitive prices, along with exceptional customer service.
            </p>
          </div>
        </div>

        {/* Location Section */}
        <div className="mt-12">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center">Our Location</h3>
          <div className="mt-6">
            <div className="text-center mb-6">
              <FaMapMarkerAlt className="text-4xl text-indigo-500 mb-4 mx-auto" />
              <p className="text-gray-600">
                SHOPSPHERE is located in Karachi, Pakistan. Visit us to explore our wide range of products and enjoy an unmatched shopping experience.
              </p>
            </div>
            <div className="relative overflow-hidden w-full h-64">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.4811895170227!2d67.00111971542372!3d24.860734384052726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33fd8aeb688ab%3A0x528d9c03b80f3e0b!2sKarachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1620192021248!5m2!1sen!2s"
                allowFullScreen=""
                loading="lazy"
                title="SHOPSPHERE Location"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="mt-12">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center">Contact Us</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <FaPhone className="text-5xl text-indigo-500 mb-4 mx-auto" />
              <h4 className="text-xl font-semibold text-gray-800">Phone</h4>
              <p className="text-gray-600 mt-2">+92 300 1234567</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <FaEnvelope className="text-5xl text-indigo-500 mb-4 mx-auto" />
              <h4 className="text-xl font-semibold text-gray-800">Email</h4>
              <p className="text-gray-600 mt-2">info@shopsphere.pk</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-semibold text-gray-800">Follow Us</h4>
              <div className="flex justify-center mt-4 space-x-4">
                <a href="https://www.facebook.com" className="text-indigo-500">
                  <FaFacebook className="text-4xl" />
                </a>
                <a href="https://www.twitter.com" className="text-indigo-500">
                  <FaTwitter className="text-4xl" />
                </a>
                <a href="https://www.instagram.com" className="text-indigo-500">
                  <FaInstagram className="text-4xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
