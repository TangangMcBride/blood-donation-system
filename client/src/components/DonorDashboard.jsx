// src/components/DonorDashboard.jsx
import React, { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import BloodRequests from './BloodRequest';
import DonationHistory from './DonationHistory';
import Notifications from './Notifications';
import QuickActions from './QuickActions';
import ProfileCompletionModal from './ProfileCompletionModal';
import { authService } from '../services/auth';

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await authService.getProfile();
        setUserData(data);
        
        const completeness = calculateProfileCompleteness(data);
        setProfileCompleteness(completeness);
        
        // Show profile modal if completeness is less than 80%
        if (completeness < 80) {
          setShowProfileModal(true);
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const calculateProfileCompleteness = (user) => {
    let completeness = 0;
    if (user.name) completeness += 20;
    if (user.phone) completeness += 20;
    if (user.bloodType) completeness += 20;
    if (user.location && user.location.coordinates) completeness += 20;
    if (user.availability !== undefined) completeness += 20;
    
    return completeness;
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const data = await authService.updateProfile(updatedData);
      setUserData(data);
      
      const completeness = calculateProfileCompleteness(data);
      setProfileCompleteness(completeness);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <p className="text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Donor Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{userData.name}</span>
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
              {userData.name.charAt(0)}
            </div>
            <button 
              onClick={handleLogout}
              className="ml-4 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['dashboard', 'requests', 'history', 'notifications'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-1 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Completeness Bar */}
        {profileCompleteness < 100 && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Complete your profile</h3>
              <span className="text-sm text-gray-500">{profileCompleteness}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-red-600 h-2.5 rounded-full"
                style={{ width: `${profileCompleteness}%` }}
              ></div>
            </div>
            <button
              onClick={() => setShowProfileModal(true)}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Complete your profile now
            </button>
          </div>
        )}

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <QuickActions user={userData} onUpdate={handleProfileUpdate} />
              <BloodRequests />
            </div>
            <div className="md:col-span-1">
              <ProfileCard user={userData} />
              <Notifications />
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Blood Requests</h2>
            <BloodRequests detailed={true} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Donation History</h2>
            <DonationHistory />
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <Notifications detailed={true} />
          </div>
        )}
      </main>

      {/* Profile Completion Modal */}
      {showProfileModal && (
        <ProfileCompletionModal
          user={userData}
          onClose={() => setShowProfileModal(false)}
          onUpdate={handleProfileUpdate}
          completeness={profileCompleteness}
        />
      )}
    </div>
  );
};

export default DonorDashboard;