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
        borderWidth: 2,
        tension: 0.4, // Smooth the line
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order Volume Daily</h3>
      <div className="relative">
        <Line data={chartData} options={{
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date',
                color: '#4B5563',
              },
              grid: {
                color: '#e5e7eb', // Light gray grid lines
              },
            },
            y: {
              title: {
                display: true,
                text: 'Total Orders',
                color: '#4B5563',
              },
              beginAtZero: true,
              grid: {
                color: '#e5e7eb', // Light gray grid lines
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: '#4B5563',
              },
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `Orders: ${tooltipItem.raw}`;
                },
              },
            },
          },
        }} />
      </div>
    </div>
  );
};

export default OrderVolumeDailyChart;
