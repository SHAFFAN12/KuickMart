import React from 'react';
import SalesReport from './analytics/SalesReport';
import axiosInstance from '../../adminaxios';
// import AdminNotificationComponent from './AdminNotification';
// import AdminNotificationDashboard from './AdminNotificationDashboard';
const Dashboard = () => {

  
  return (
    <div>
      {/* <AdminNotificationComponent/> */}
      {/* <AdminNotificationDashboard/> */}
      <SalesReport/>
    </div>
  );
};

export default Dashboard;
