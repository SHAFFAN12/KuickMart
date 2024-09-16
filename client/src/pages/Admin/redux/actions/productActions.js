import axios from 'axios';
import Swal from 'sweetalert2';

// Action Types
export const PRODUCT_LIST_REQUEST = 'PRODUCT_LIST_REQUEST';
export const PRODUCT_LIST_SUCCESS = 'PRODUCT_LIST_SUCCESS';
export const PRODUCT_LIST_FAIL = 'PRODUCT_LIST_FAIL';
export const PRODUCT_CREATE_REQUEST = 'PRODUCT_CREATE_REQUEST';
export const PRODUCT_CREATE_SUCCESS = 'PRODUCT_CREATE_SUCCESS';
export const PRODUCT_CREATE_FAIL = 'PRODUCT_CREATE_FAIL';
export const PRODUCT_UPDATE_REQUEST = 'PRODUCT_UPDATE_REQUEST';
export const PRODUCT_UPDATE_SUCCESS = 'PRODUCT_UPDATE_SUCCESS';
export const PRODUCT_UPDATE_FAIL = 'PRODUCT_UPDATE_FAIL';
export const PRODUCT_DELETE_REQUEST = 'PRODUCT_DELETE_REQUEST';
export const PRODUCT_DELETE_SUCCESS = 'PRODUCT_DELETE_SUCCESS';
export const PRODUCT_DELETE_FAIL = 'PRODUCT_DELETE_FAIL';

// List Products
export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { data } = await axios.get('http://localhost:5000/api/products');
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// Create Product
export const createProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `${userInfo.token}`,
      },
    };

    const { data } = await axios.post('http://localhost:5000/api/products', product, config);
    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });
  console.log("Response"+data)
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// Update Product
export const updateProduct = (id, product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_UPDATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`http://localhost:5000/api/products/${id}`, product, config);
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
    Swal.fire('Updated!', 'Product updated successfully', 'success');
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
    Swal.fire('Error!', error.response.data.message || 'Failed to update product', 'error');
  }
};

// Delete Product
export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`http://localhost:5000/api/products/${id}`, config);
    dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: id });
    Swal.fire('Deleted!', 'Product has been deleted.', 'success');
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
