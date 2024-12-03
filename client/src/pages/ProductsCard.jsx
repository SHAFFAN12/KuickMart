import React from 'react'

const ProductsCard = () => {
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {/* Single Card */}
      <div className="w-64 bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <img
            src="https://via.placeholder.com/150"
            alt="Leather Gloves"
            className="rounded-md w-full"
          />
          <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:shadow-md">
            ❤️
          </button>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Leather Gloves</h2>
          <p className="text-sm text-gray-500">Perfect mint green</p>
          <div className="flex gap-2 mt-2">
            <div className="w-5 h-5 rounded-full bg-green-300"></div>
            <div className="w-5 h-5 rounded-full bg-blue-300"></div>
            <div className="w-5 h-5 rounded-full bg-gray-400"></div>
            <div className="w-5 h-5 rounded-full bg-black"></div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-green-600">$42</span>
            <span className="flex items-center gap-1 text-sm text-yellow-500">
              ⭐ 4.9 (98 reviews)
            </span>
          </div>
        </div>
      </div>

      
    </div>
  )
}

export default ProductsCard
