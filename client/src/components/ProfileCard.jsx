// src/components/ProfileCard.jsx
import React from 'react';

const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600">Blood Donor</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Blood Type:</span>
          <span className="font-semibold">{user.bloodType || 'Not specified'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`font-semibold ${user.availability ? 'text-green-600' : 'text-red-600'}`}>
            {user.availability ? 'Available' : 'Not Available'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="font-semibold">
            {user.location ? `${user.location.city}, ${user.location.address}` : 'Not specified'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Phone:</span>
          <span className="font-semibold">{user.phone || 'Not specified'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Email:</span>
          <span className="font-semibold">{user.email}</span>
        </div>
      </div>
      
      <button className="mt-4 w-full bg-red-100 text-red-700 py-2 rounded-md hover:bg-red-200 transition">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;