import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import DashboardCard from './components/DashboardCard';
import SalesByCategoryChart from './components/SalesByCategoryChart';
import TopCustomersList from './components/TopCustomerList';
import TopSellingProductsList from './components/TopSellingProductList';
import OrdersByStatusChart from './components/OrdersByStatusChart';
import OrderVolumeDailyChart from './components/OrderVolumeDailyChart';
import AverageDeliveryTime from './components/AverageDeliveryTime';
import {
  fetchTotalSales,
  fetchOrderCount,
  fetchAverageOrderValue,
  fetchSalesByCategory,
  fetchCustomerCount,
  fetchNewCustomers,
  fetchTopCustomers,
  fetchTopSellingProducts,
  fetchOrdersByStatus,
  fetchOrderVolumeDaily,
  fetchAverageDeliveryTime
} from './components/api';

const Reports = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [newCustomers, setNewCustomers] = useState(0);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [orderVolumeDaily, setOrderVolumeDaily] = useState([]);
  const [averageDeliveryTime, setAverageDeliveryTime] = useState(0);

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sales = await fetchTotalSales();
      setTotalSales(sales);

      const orders = await fetchOrderCount();
      setOrderCount(orders);

      const avgOrderValue = await fetchAverageOrderValue();
      setAverageOrderValue(avgOrderValue);

      const salesByCat = await fetchSalesByCategory();
      setSalesByCategory(salesByCat);

      const customers = await fetchCustomerCount();
      setCustomerCount(customers);

      const newCust = await fetchNewCustomers();
      setNewCustomers(newCust);

      const topCust = await fetchTopCustomers();
      setTopCustomers(topCust);

      const topProd = await fetchTopSellingProducts();
      setTopSellingProducts(topProd);

      const ordersStatus = await fetchOrdersByStatus();
      setOrdersByStatus(ordersStatus);

      const orderVolume = await fetchOrderVolumeDaily();
      setOrderVolumeDaily(orderVolume);

      const avgDeliveryTime = await fetchAverageDeliveryTime();
      setAverageDeliveryTime(avgDeliveryTime);
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 60000); // Refresh every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="spinner-border animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <DashboardCard title="Total Sales" value={totalSales} isCurrency />
            <DashboardCard title="Total Orders" value={orderCount} />
            <DashboardCard title="Avg Order Value" value={averageOrderValue} isCurrency />
            <DashboardCard title="Customer Count" value={customerCount} />
            <DashboardCard title="New Customers" value={newCustomers} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SalesByCategoryChart data={salesByCategory} />
            <TopCustomersList customers={topCustomers} />
            <TopSellingProductsList products={topSellingProducts} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <OrdersByStatusChart data={ordersByStatus} />
            <OrderVolumeDailyChart data={orderVolumeDaily} />
            <AverageDeliveryTime time={averageDeliveryTime} />
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
