import React, { useState } from 'react';
import { authService } from '../services/auth';

const QuickActions = ({ user, onUpdate }) => {
  const [availability, setAvailability] = useState(user.availability);
  const [loading, setLoading] = useState(false);

  const toggleAvailability = async () => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile({ 
        availability: !availability 
      });
      setAvailability(!availability);
      onUpdate(updatedUser);
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability');
    } finally {
      setLoading(false);
    }
  };
   return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={toggleAvailability}
          className={`p-4 rounded-lg text-center ${
            availability 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          } transition`}
        >
          <div className="text-2xl mb-2">
            {availability ? '✅' : '❌'}
          </div>
          <span className="font-semibold">
            {availability ? 'Available' : 'Not Available'}
          </span>
        </button>
        
        <button className="p-4 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition">
          <div className="text-2xl mb-2">📅</div>
          <span className="font-semibold">Schedule Donation</span>
        </button>
        
        <button className="p-4 rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 transition">
          <div className="text-2xl mb-2">📍</div>
          <span className="font-semibold">Find Centers</span>
        </button>
        
        <button className="p-4 rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition">
          <div className="text-2xl mb-2">📊</div>
          <span className="font-semibold">My Stats</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;