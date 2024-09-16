import axiosInstance from "../../../adminaxios";

// Fetch all orders
export const getOrders = async () => {
  try {
    const res = await axiosInstance.get('/orders');
    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    throw error;
  }
};

// Fetch a single order by ID
export const getOrderById = async (id) => {
  try {
    const res = await axiosInstance.get(`/orders/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching order:', error.message);
    throw error;
  }
};

// Update an order by ID
export const updateOrder = async (id, orderData) => {
  try {
    const res = await axiosInstance.put(`/orders/${id}`, orderData);
    return res.data;
  } catch (error) {
    console.error('Error updating order:', error.message);
    throw error;
  }
};

// Delete an order by ID
export const deleteOrder = async (id) => {
  try {
    await axiosInstance.delete(`/orders/${id}`);
  } catch (error) {
    console.error('Error deleting order:', error.message);
    throw error;
  }
};
