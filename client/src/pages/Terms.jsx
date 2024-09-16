import React from 'react';
import { FaUndoAlt, FaBalanceScale, FaShieldAlt } from 'react-icons/fa';

const Terms = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Terms & Conditions</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Welcome to SHOPSPHERE. Please read our terms and conditions carefully before using our services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          {/* Return Policy */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaUndoAlt className="text-5xl text-indigo-500 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800">3-Day Return Policy</h3>
            <p className="text-gray-600 mt-2">
              We offer a 3-day return policy on our products. If you are not satisfied with your purchase, you can return it within 3 days for a full refund, provided that the product is in its original condition.
            </p>
          </div>

          {/* Fair Trading Policy */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaBalanceScale className="text-5xl text-indigo-500 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800">Fair Trading Policy</h3>
            <p className="text-gray-600 mt-2">
              At SHOPSPHERE, we adhere to the principles of fairness in all our transactions, ensuring that our business practices are transparent and in line with  principles.
            </p>
          </div>

          {/* Customer Protection Policy */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaShieldAlt className="text-5xl text-indigo-500 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-800">Customer Protection</h3>
            <p className="text-gray-600 mt-2">
              We prioritize the safety and security of our customers. All personal information and transactions are handled with the utmost care and confidentiality.
            </p>
          </div>
        </div>

        {/* Additional Policies Section */}
        <div className="mt-12">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center">Additional Policies</h3>
          <div className="mt-6 text-center">
            <ul className="list-disc list-inside text-gray-600 max-w-2xl mx-auto">
              <li>All prices are final and non-negotiable.</li>
              <li>Product availability is subject to change without notice.</li>
              <li>Customers are responsible for ensuring that their order information is accurate.</li>
            </ul>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            By using our platform, you agree to our terms and conditions. If you have any questions or concerns, please feel free to contact us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
