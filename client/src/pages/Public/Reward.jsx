import React, { useEffect, useState } from 'react';
import axiosInstance from '../../publicaxios';
import Swal from 'sweetalert2';
import { FaTrophy } from 'react-icons/fa';

const CustomerRewards = ({ onPointsRedeemed }) => {
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for redeem action

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axiosInstance.get('/rewards');
        setRewards(response.data);
      } catch (error) {
        console.error('Error fetching rewards:', error);
      }
    };

    fetchRewards();
  }, []);

  const redeemRewards = async () => {
    if (!rewards || rewards.points <= 0) {
      Swal.fire({
        title: 'No Points Available',
        text: 'You do not have enough points to redeem rewards.',
        icon: 'info',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/rewards/redeem', { pointsToRedeem: rewards.points });
      Swal.fire({
        title: 'Success!',
        text: `Rewards redeemed! Discount of $${response.data.discount.toFixed(2)} applied.`,
        icon: 'success',
        confirmButtonText: 'OK',
      });
      setRewards({ ...rewards, points: 0 });
      onPointsRedeemed(response.data.discount);
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Error redeeming rewards.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      console.error('Error redeeming rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  if (rewards === null) {
    return (
      <div className="flex items-center justify-center py-4">
        <span className="text-gray-500">Loading rewards...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-md mb-6">
      <FaTrophy className="text-yellow-500 text-2xl" />
      <div>
        <p className="text-gray-700">
          <strong>Your Reward Points:</strong> {rewards.points}
        </p>
        <p className="text-gray-500 text-sm">
          Redeem your points for discounts on your order.
        </p>
      </div>
      <button
        type="button"
        onClick={redeemRewards}
        disabled={loading || rewards.points <= 0}
        className={`${
          loading || rewards.points <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
        } text-white py-2 px-4 rounded-md transition duration-300`}
      >
        {loading ? 'Redeeming...' : 'Redeem Rewards'}
      </button>
    </div>
  );
};

export default CustomerRewards;
