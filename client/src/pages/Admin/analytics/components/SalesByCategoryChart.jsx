// src/pages/Admin/analytics/components/SalesByCategoryChart.jsx

import React from 'react';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(...registerables);

const SalesByCategoryChart = ({ data }) => {
  // Prepare chart data
  console.log(data)
  const chartData = {
    labels: data.map((category) => category.category), // Categories as labels
    datasets: [
      {
        label: 'Sales',
        data: data.map((category) => category.totalSales), // Sales data
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Category',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Sales',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Sales by Category</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SalesByCategoryChart;
