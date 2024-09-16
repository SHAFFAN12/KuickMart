import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { removeFromCart, updateCartItem } from './redux/actions/cartActions';

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const updateQuantity = (id, qty) => {
    dispatch(updateCartItem(id, qty));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.price ? item.price : 0;
      const qty = item.qty ? item.qty : 0;
      return acc + qty * price;
    }, 0).toFixed(2);
  };

  const calculateTotalQuantity = () => {
    return cartItems.reduce((acc, item) => {
      const qty = item.qty ? item.qty : 0;
      return acc + qty;
    }, 0);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link to="/" className="text-blue-500 hover:underline">Go Back</Link>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6 lg:p-8">
            {cartItems.map((item) => (
              <div key={item.product} className="flex flex-col md:flex-row items-center border-b py-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-md mb-4 md:mb-0 md:mr-4"
                  onError={(e) => (e.target.src = '/path/to/placeholder-image.png')}
                />
                <div className="flex-1">
                  <Link to={`/product/${item.product}`} className="text-lg font-semibold hover:underline">
                    {item.name}
                  </Link>
                  <div className="flex items-center mt-2">
                    <span className="text-gray-600">Qty:</span>
                    <select
                      value={item.qty}
                      onChange={(e) => updateQuantity(item.product, Number(e.target.value))}
                      className="ml-2 border rounded-md p-1"
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-gray-600">Color:</span>
                    <div
                      className="w-6 h-6 ml-2 rounded-full border border-gray-300"
                      style={{ backgroundColor: item.color.replace(/[\[\]"]/g, '').trim() }}
                    ></div>
                  </div>
                </div>
                <div className="text-lg font-semibold mt-2 md:mt-0 md:ml-4">
                  ${item.price ? item.price.toFixed(2) : '0.00'}
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCartHandler(item.product)}
                  className="ml-0 md:ml-4 mt-4 md:mt-0 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center"
                >
                  <FaTrashAlt className="mr-2" />
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-white shadow-md rounded-lg p-4 md:p-6 lg:p-8 flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold">
              Subtotal ({calculateTotalQuantity()}) items
            </h2>
            <span className="text-xl md:text-2xl font-semibold mt-2 md:mt-0">
              ${calculateTotalPrice()}
            </span>
            <Link to="/checkout" className="mt-4 md:mt-0">
              <button
                type="button"
                disabled={cartItems.length === 0}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition ${
                  cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Proceed To Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
