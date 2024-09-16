// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import orderReducer from './orderReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  order: orderReducer,
  // Add other reducers here
});

export default rootReducer;
