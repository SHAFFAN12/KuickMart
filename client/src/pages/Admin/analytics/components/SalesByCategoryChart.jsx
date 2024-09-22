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
        backgroundColor: (context) => {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(34,193,195,0.6)'); // Starting color
          gradient.addColorStop(1, 'rgba(253,187,45,0.6)'); // Ending color
          return gradient;
        },
        borderColor: 'rgba(34,193,195,1)',
        borderWidth: 2, 
        hoverBackgroundColor: 'rgba(253,187,45,1)', // Different on hover
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#334155', // Dark text for legend
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Category',
          color: '#1E293B', // Darker title color
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          color: '#475569', // Dark ticks
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Sales',
          color: '#1E293B', // Darker title color
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        ticks: {
          beginAtZero: true,
          color: '#475569', // Dark ticks
        },
      },
    },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-8 transition hover:shadow-xl hover:scale-105 transform duration-300 ease-in-out">
      <h3 className="text-2xl font-bold text-gray-700 mb-4">Sales by Category</h3>
      <Bar data={chartData} options={options} />
      <div className="flex justify-end mt-2 text-sm text-gray-500">
        <span>Data updated: September 2024</span>
      </div>
    </div>
  );
};

export default SalesByCategoryChart;
