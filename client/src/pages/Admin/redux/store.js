import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { authReducer } from './reducers/authReducer';
import { productReducer } from './reducers/productReducer';
import { orderReducer } from './reducers/orderReducer';
import { userReducer } from './reducers/userReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  orders: orderReducer,
  users: userReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
