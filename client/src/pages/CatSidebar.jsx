import React from 'react';
import { IoIosLogOut } from 'react-icons/io';

const CatSidebar = ({ navigate }) => {
  const categories = [
    { name: 'Fashion', path: '/categories/fashion' },
    { name: 'Electronics', path: '/categories/electronics' },
    { name: 'Home', path: '/categories/home' },
    { name: 'Beauty', path: '/categories/beauty' },
  ];

  return (
    <div className="flex"> {/* Flex container */}
      <div className="bg-[#E3E9EF] text-gray-800 p-4 w-[100px] md:hidden fixed left-0 h-full overflow-y-auto"> 
        <div className="flex flex-col items-center space-y-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex flex-col items-center text-gray-800 text-center rounded-lg p-2 w-full cursor-pointer"
              onClick={() => navigate(category.path)}
            >
              <IoIosLogOut size={24} />
              <p className="mt-1">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-black flex-1 h-full md:hidden"> 

      </div>
    </div>
  );
};

export default CatSidebar;
