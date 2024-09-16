import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ className }) => {
  return (
    <aside className={`admin-sidebar bg-blue-500 text-white h-full ${className}`}>
      <nav className="p-4">
        <ul>
          <li className="py-2">
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li className="py-2">
            <Link to="/admin/products">Manage Products</Link>
          </li>
          <li className="py-2">
            <Link to="/admin/orders">Manage Orders</Link>
          </li>
          <li className="py-2">
            <Link to="/admin/users">Manage Users</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
