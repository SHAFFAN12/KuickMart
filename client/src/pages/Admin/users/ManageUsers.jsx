import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getAllUsers, deleteUser } from './api';
import 'tailwindcss/tailwind.css';
import { FaInfoCircle, FaTrash } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this user!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await deleteUser(id);
        setUsers(users.filter(user => user._id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'User has been deleted.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  const handleViewDetails = (user) => {
    Swal.fire({
      title: `User Details`,
      html: `
        <div class="text-left">
          <p class="font-semibold"><strong>Name:</strong> ${user.name}</p>
          <p class="font-semibold"><strong>Email:</strong> ${user.email}</p>
          <p class="font-semibold"><strong>Role:</strong> ${user.isAdmin ? 'Admin' : 'Customer'}</p>
          <p class="font-semibold"><strong>Google ID:</strong> ${user.googleId}</p>
          <p class="font-semibold"><strong>Created At:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
          <p class="font-semibold"><strong>Updated At:</strong> ${new Date(user.updatedAt).toLocaleString()}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      customClass: {
        popup: 'bg-white shadow-lg rounded-lg p-6',
        title: 'text-xl font-bold text-gray-800 mb-4',
        htmlContainer: 'text-gray-700',
        confirmButton: 'bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300'
      }
    });
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.isAdmin ? 'Admin' : 'Customer'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="text-blue-600 hover:text-blue-900 mr-4 transition duration-300"
                      aria-label="View Details"
                    >
                      <FaInfoCircle />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-900 transition duration-300"
                      aria-label="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
