import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import Admin from './pages/Admin/index.jsx'
import './index.css'
import {Provider} from 'react-redux'
import store from './pages/Public/redux/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <Provider store={store}>
{/* <Admin/> */}
    <App />
   </Provider>
  </React.StrictMode>,
)
