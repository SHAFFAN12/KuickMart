// store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import authReducer from './reducers/authReducer';
import orderReducer from './reducers/orderReducer';
import cartReducer from './reducers/cartReducer';
import adminAuthReducer from '../../Admin/redux/reducers/authReducer';
import adminProductReducer from '../../Admin/redux/reducers/productReducer';
import adminOrderReducer from '../../Admin/redux/reducers/orderReducer';
import adminUserReducer from '../../Admin/redux/reducers/userReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  order: orderReducer,
  cart: cartReducer,
  adminAuth: adminAuthReducer,
  adminProducts: adminProductReducer,
  adminOrders: adminOrderReducer,
  adminUsers: adminUserReducer,
});

const store = createStore(
  
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
