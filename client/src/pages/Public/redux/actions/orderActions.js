import axios from 'axios';
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
} from './types';

const fetchUserDetails = async (token) => {
  try {
    const { data } = await axios.get('http://localhost:5000/api/auth/getuser', {
      headers: {
        Authorization: `${localStorage.getItem('token')}`, // Ensure token is prefixed with 'Bearer '
      },
    });
    return data;
  } catch (error) {
    throw new Error('Failed to fetch user details');
  }
};

export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token is missing');
    }

    const user = await fetchUserDetails(token);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`, // Include token in request headers
      },
    };

    const orderData = {
      orderItems: order.orderItems,
      shippingAddress: order.shippingAddress,
      phoneNumber: order.phoneNumber,
      paymentMethod: order.paymentMethod,
      itemsPrice: order.itemsPrice,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
      user: user._id,
    };

    const { data } = await axios.post('http://localhost:5000/api/orders', orderData, config);
    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });

    localStorage.removeItem('cartItems');
  } catch (error) {
    console.error('Order creation error:', error.response ? error.response.data.message : error.message);
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
