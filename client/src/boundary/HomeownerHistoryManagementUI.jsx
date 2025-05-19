// HomeownerHistoryManagementUI.jsx

import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import CustomTable from '../components/CustomTable';
import './CleanerServiceManagementUI.css'; // resuse service management css


function HomeownerHistoryManagementUI() {
  // Get the cleaningservicename from local storage
  const usernameStored = localStorage.getItem('loggedInUser');

  // State variables for form inputs, add service
  const [cleaningservicename, setCleaningServiceName] = useState('');
  const [cleanerusername, setCleanerUsername] = useState(usernameStored);
  const [homeownerusername, setHomeownerUsername] = useState('');
  const [cleaninglocation, setCleaningLocation] = useState('');
  const [cleaningdate, setCleaningDate] = useState('');
  const [cleaningstarttime, setCleaningStartTime] = useState('');
  const [cleaningendtime, setCleaningEndTime] = useState('');

  // Add state for service list and search name
  const [serviceList, setServiceList] = useState([]);
  const [searchServiceName, setSearchServiceName] = useState('');

  //add state for service details modal, view service details
  const [selectedService, setSelectedService] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);


  const openDetailsModal = (service) => {
    setSelectedService(service);
    setShowDetailsModal(true);
  };
  
  //for debugging purposes
  console.log('Sending:', {
    cleanerusername,
    homeownerusername,
    cleaningservicename,
    cleaninglocation,
    cleaningdate,
    cleaningstarttime,
    cleaningendtime
  });

  
  // get all services
  const viewHistory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/homeowner/history/all/${usernameStored}`);
      const data = await res.json();
      setServiceList(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  const searchHistory = async () => {
    try {
      const query = searchServiceName ? `?cleaningservicename=${searchServiceName}` : '';
      const res = await fetch(`http://localhost:5000/api/homeowner/history/${usernameStored}${query}`);
      const data = await res.json();
      setServiceList(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  }
  
  
  useEffect(() => {
    viewHistory(); // fetch all services on page load
  }, []);
  
  useEffect(() => {
    searchHistory(); // fetch filtered services when searchServiceName changes
  }, [searchServiceName]);



  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Welcome, {usernameStored}!</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          {/* Search bar */}
          <input
            type="text"
            placeholder="Search by service name"
            value={searchServiceName}
            onChange={e => setSearchServiceName(e.target.value)}
            className="search-bar"
          />          
          
        </div>
        
        {/* view services list */}
        <div className="search-section">
          <CustomTable
            columns={[
              { id: 'cleaningservicename', label: 'Service Name' },
              { id: 'cleanerusername', label: 'Cleaner username' },
              { id: 'cleaningdate', label: 'Date' }
            ]}
            data={serviceList}
            onEdit={openDetailsModal}
          />
        </div>

        {/* Service Details Modal */}
        {showDetailsModal && selectedService && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Cleaning Service Details</h3>
                <button className="close-button" onClick={() => setShowDetailsModal(false)}>×</button>
              </div>
              <div className="form-group"><strong>Cleaner Username:</strong> {selectedService.cleanerusername}</div>
              <div className="form-group"><strong>Service Name:</strong> {selectedService.cleaningservicename}</div>
              <div className="form-group"><strong>Homeowner Username:</strong> {selectedService.homeownerusername}</div>
              <div className="form-group"><strong>Cleaning Location:</strong> {selectedService.cleaninglocation}</div>
              <div className="form-group"><strong>Cleaning Date:</strong> {selectedService.cleaningdate}</div>
              <div className="form-group"><strong>Cleaning Start Time:</strong> {selectedService.cleaningstarttime}</div>
              <div className="form-group"><strong>Cleaning End Time:</strong> {selectedService.cleaningendtime}</div>
              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => setSelectedService(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    );
  }
export default HomeownerHistoryManagementUI;
