// api/analytics.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analytics';

export const fetchTotalSales = async () => {
  const { data } = await axios.get(`${API_URL}/total-sales`);
  return data.totalSales || 0;
};

export const fetchOrderCount = async () => {
  const { data } = await axios.get(`${API_URL}/order-count`);
  return data.orderCount || 0;
};

export const fetchAverageOrderValue = async () => {
  const { data } = await axios.get(`${API_URL}/average-order-value`);
  return data.averageOrderValue || 0;
};

export const fetchSalesByCategory = async () => {
  const { data } = await axios.get(`${API_URL}/sales-by-category`);
  return data || [];
};

export const fetchCustomerCount = async () => {
  const { data } = await axios.get(`${API_URL}/customer-count`);
  return data.customerCount || 0;
};

export const fetchNewCustomers = async () => {
  const { data } = await axios.get(`${API_URL}/new-customers`);
  return data.newCustomers || 0;
};

export const fetchTopCustomers = async () => {
  const { data } = await axios.get(`${API_URL}/top-customers`);
  return data || [];
};

export const fetchTopSellingProducts = async () => {
  const { data } = await axios.get(`${API_URL}/top-selling-products`);
  return data || [];
};

export const fetchOrdersByStatus = async () => {
  const { data } = await axios.get(`${API_URL}/orders-by-status`);
  return data || [];
};

export const fetchOrderVolumeDaily = async () => {
  const { data } = await axios.get(`${API_URL}/order-volume-daily`);
  return data || [];
};

export const fetchAverageDeliveryTime = async () => {
  const { data } = await axios.get(`${API_URL}/average-delivery-time`);
  return data.averageDeliveryTime || 0;
};
