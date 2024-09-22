// components/OrdersByStatusChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';

const OrdersByStatusChart = ({ data }) => {
  const chartData = {
    labels: ['Paid Delivered', 'Paid Undelivered', 'Unpaid Delivered', 'Unpaid Undelivered'],
    datasets: [
      {
        label: 'Orders',
        data: [
          data.filter(order => order.isPaid && order.isDelivered).length,
          data.filter(order => order.isPaid && !order.isDelivered).length,
          data.filter(order => !order.isPaid && order.isDelivered).length,
          data.filter(order => !order.isPaid && !order.isDelivered).length,
        ],
        backgroundColor: [
          '#4caf50',
          '#ff9800',
          '#f44336',
          '#9c27b0',
        ],
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Orders by Status</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default OrdersByStatusChart;
