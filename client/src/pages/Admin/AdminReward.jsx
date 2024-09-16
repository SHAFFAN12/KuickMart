import React, { useEffect, useState } from 'react';
import api from '../../adminaxios'; // Import the configured Axios instance
import Swal from 'sweetalert2';
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa';

const AdminRewardPolicies = () => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await api.get('/reward-policies');
        setPolicies(response.data);
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };

    fetchPolicies();
  }, []);

  const createPolicy = async (form) => {
    try {
      const response = await api.post('/reward-policies', form);
      Swal.fire({
        title: 'Success!',
        text: 'Reward policy created successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
      setPolicies([...policies, response.data.policy]);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Error creating reward policy.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Error creating policy:', error);
    }
  };

  const handleCreatePolicy = () => {
    Swal.fire({
      title: 'Create Reward Policy',
      html: `
        <input id="name" class="swal2-input" placeholder="Name">
        <input id="description" class="swal2-input" placeholder="Description">
        <input id="pointsPerCurrencyUnit" class="swal2-input" type="number" placeholder="Points per Currency Unit">
      `,
      confirmButtonText: 'Create Policy',
      focusConfirm: false,
      preConfirm: () => {
        const name = Swal.getPopup().querySelector('#name').value;
        const description = Swal.getPopup().querySelector('#description').value;
        const pointsPerCurrencyUnit = Swal.getPopup().querySelector('#pointsPerCurrencyUnit').value;

        if (!name || !description || !pointsPerCurrencyUnit) {
          Swal.showValidationMessage(`Please fill all fields`);
        }
        return {
          name,
          description,
          pointsPerCurrencyUnit: Number(pointsPerCurrencyUnit),
          isActive: true,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        createPolicy(result.value);
      }
    });
  };

  const updatePolicy = async (policyId, updates) => {
    try {
      const response = await api.put('/reward-policies', { policyId, ...updates });
      Swal.fire({
        title: 'Success!',
        text: `Policy ${updates.isActive ? 'activated' : 'deactivated'} successfully.`,
        icon: 'success',
        confirmButtonText: 'OK',
      });
      setPolicies(policies.map(policy => policy._id === policyId ? response.data.policy : policy));
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Error updating reward policy.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Error updating policy:', error);
    }
  };

  const handleDeletePolicy = async (policyId) => {
    try {
      await api.delete(`/reward-policies/${policyId}`);
      Swal.fire('Deleted!', 'Policy has been deleted.', 'success');
      setPolicies(policies.filter(p => p._id !== policyId));
    } catch (error) {
      Swal.fire('Error!', 'Error deleting policy.', 'error');
      console.error('Error deleting policy:', error);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Admin Reward Policies</h2>
      <button
        onClick={handleCreatePolicy}
        className="bg-blue-500 text-white p-2 rounded-md flex items-center gap-2 mb-6"
      >
        <FaPlusCircle /> Create Policy
      </button>
      <ul>
        {policies.map(policy => (
          <li key={policy._id} className="bg-white p-4 mb-4 rounded-md shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-xl font-medium">{policy.name}</h3>
              <p className="text-gray-700">{policy.description}</p>
              <p className="text-gray-500">Points per Currency Unit: {policy.pointsPerCurrencyUnit}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updatePolicy(policy._id, { isActive: !policy.isActive })}
                className={`p-2 rounded-md ${policy.isActive ? 'bg-green-500' : 'bg-red-500'} text-white`}
              >
                {policy.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => Swal.fire({
                  title: 'Are you sure?',
                  text: "You won't be able to revert this!",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete it!'
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    handleDeletePolicy(policy._id);
                  }
                })}
                className="p-2 bg-red-500 text-white rounded-md"
              >
                <FaTrashAlt />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRewardPolicies;
