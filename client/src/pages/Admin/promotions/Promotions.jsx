import React from 'react';
import AdminNotificationComponent from './AdminNotification';
import AdminNotificationDashboard from './AdminNotificationDashboard';

const Promotions = () => {
  return (
    <div className="space-y-8">
      <AdminNotificationDashboard />
      <AdminNotificationComponent />
    </div>
  );
};

export default Promotions;
