// components/OrderVolumeDailyChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';

const OrderVolumeDailyChart = ({ data }) => {
  const chartData = {
    labels: data.map((volume) => volume._id),
    datasets: [
      {
        label: 'Total Orders',
        data: data.map((volume) => volume.totalOrders),
        fill: false,
        borderColor: '#4caf50',
      },
    ],
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Order Volume Daily</h3>
      <Line data={chartData} />
    </div>
  );
};

export default OrderVolumeDailyChart;
