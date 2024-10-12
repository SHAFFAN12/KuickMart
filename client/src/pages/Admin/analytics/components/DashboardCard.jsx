// import React from 'react';

// const DashboardCard = ({ title, value, isCurrency }) => {
//   return (
//     <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
//       <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
//       <p className={`text-2xl font-bold ${isCurrency ? 'text-green-600' : 'text-gray-900'}`}>
//         {isCurrency ? `$${value.toFixed(2)}` : value}
//       </p>
//     </div>
//   );
// };

// export default DashboardCard;

import React from 'react';
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";


const DashboardCard = ({ title, value, isCurrency, color, grow, icon }) => {
  return (
    <div
      className="dashboardBox rounded-lg shadow-md p-6 flex flex-col justify-between"
      style={{
        backgroundImage: `linear-gradient(to right, ${color[0]}, ${color[1]})`,
        position: 'relative', // For icon positioning
      }}
    >
      <span className="chart" style={{ position: 'absolute', }}>
        {grow ? <FiTrendingUp /> : <FiTrendingDown />}
      </span>
      
      <div className="flex w-full">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className={`text-2xl font-bold ${isCurrency ? 'text-white' : 'text-white'}`}>
      {isCurrency ? `Rs ${value.toFixed(2)}` : value}
    </p>
        </div>

        <div className="ml-auto">
          {icon && <span className="flex items-center justify-center w-[50px] h-[50px] rounded-[10px] text-[18px] opacity-[0.5]"
          style={{backgroundImage: 'linear-gradient(to bottom right,rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.3))'}}
          >{icon}</span>}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;

