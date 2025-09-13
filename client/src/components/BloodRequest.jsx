// src/components/BloodRequests.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';

const BloodRequests = ({ detailed = false }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBloodRequests = async () => {
      try {
        const response = await API.get('/requests');
        setRequests(response.data.requests || []);
      } catch (err) {
        setError('Failed to load blood requests');
        console.error('Error fetching blood requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBloodRequests();
  }, []);

  const handleRespond = async (requestId, response) => {
    try {
      await API.post(`/requests/${requestId}/respond`, { response });
      
      // Update the request status in UI
      setRequests(requests.map(req => 
        req._id === requestId ? { ...req, status: response } : req
      ));
    } catch (error) {
      console.error('Error responding to request:', error);
      alert('Failed to respond to request');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Blood Requests</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (detailed) {
    return (
      <div>
        {requests.length === 0 ? (
          <p className="text-gray-500">No blood requests available at the moment.</p>
        ) : (
          <div className="space-y-4">
            {requests.map(request => (
              <div key={request._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{request.patientName}</h3>
                    <p className="text-gray-600">Blood Type: <span className="font-semibold">{request.bloodType}</span></p>
                    <p className="text-gray-600">Units Required: <span className="font-semibold">{request.unitsRequired}</span></p>
                    <p className="text-gray-600">Hospital: <span className="font-semibold">{request.hospital.name}</span></p>
                    <p className="text-gray-600">Urgency: <span className={`font-semibold ${
                      request.urgency === 'High' ? 'text-red-600' : 
                      request.urgency === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>{request.urgency}</span></p>
                    <p className="text-gray-600">Distance: <span className="font-semibold">{request.distance} km</span></p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      request.status === 'Open' ? 'bg-green-100 text-green-800' :
                      request.status === 'Matched' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
                
                {request.status === 'Open' && (
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => handleRespond(request._id, 'Accepted')}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      Accept Request
                    </button>
                    <button 
                      onClick={() => handleRespond(request._id, 'Declined')}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Blood Requests</h2>
        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
          {requests.length} active
        </span>
      </div>
      
      {requests.length === 0 ? (
        <p className="text-gray-500">No blood requests in your area.</p>
      ) : (
        <div className="space-y-3">
          {requests.slice(0, 3).map(request => (
            <div key={request._id} className="border-l-4 border-red-500 pl-3 py-1">
              <h3 className="font-semibold">{request.bloodType} needed</h3>
              <p className="text-sm text-gray-600">
                {request.hospital.name} • {request.distance} km away
              </p>
              <p className="text-xs text-gray-500">
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {requests.length > 3 && (
        <button className="mt-3 text-sm text-red-600 hover:text-red-800">
          View all requests
        </button>
      )}
    </div>
  );
};

export default BloodRequests;