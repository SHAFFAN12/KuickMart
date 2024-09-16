import axios from "axios";
export const addToCart = (id, qty, selectedColor) => async (dispatch, getState) => {
  const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
  
  // console.log(data.images[0])
  dispatch({
    type: 'CART_ADD_ITEM',
    payload: {
      product: data._id,
      name: data.name,
      image: data.images[0],
      price: data.price,
      color: selectedColor,
      category: data.category,
      countInStock: data.countInStock,
      qty,
    },
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: 'CART_REMOVE_ITEM',
    payload: id,
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const updateCartItem = (id, qty) => (dispatch, getState) => {
  dispatch({
    type: 'CART_UPDATE_ITEM',
    payload: { id, qty },
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};