// HomeownerManagementUI.jsx

import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import CustomTable from '../components/CustomTable';
import './CleanerServiceManagementUI.css';
// import './HomeownerShortlistManagementUI.css'; // Add specific styles for this UI

function HomeownerShortlistManagementUI() {

  // Get the homeowner's username from local storage
  const usernameStored = localStorage.getItem('loggedInUser');
  
  // Add state for service list and search name
  const [serviceList, setServiceList] = useState([]);
  const [searchServiceName, setSearchServiceName] = useState('');

  //add state for service details modal, view service details (keep if needed)
  const [selectedService, setSelectedService] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const openDetailsModal = (service) => {
    setSelectedService(service);
    setShowDetailsModal(true);
  };

  // view all shortlisted services for the logged-in user
  const viewShortlist = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/homeowner/shortlist/view?homeownerusername=${usernameStored}`);
        const data = await res.json();
        setServiceList(data);
    } catch (err) {
        console.error('Failed to fetch services:', err);
    }
  }; 
    
  // search shortlisted services by name for the logged-in user
  const searchShortlist = async () => {
    try {
      const query = new URLSearchParams({
        homeownerusername: usernameStored,
        ...(searchServiceName && { cleaningservicename: searchServiceName })
      });
  
      const res = await fetch(`http://localhost:5000/api/homeowner/shortlist/search?${query}`);
      const data = await res.json();
      setServiceList(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  }
  
  useEffect(() => {
    viewShortlist(); // fetch all shortlisted services on initial load
  }, []); 

  useEffect(() => {
    searchShortlist(); // search shortlisted services when search term changes
  }, [searchServiceName]);
    
  return(     
    <div>
      <Navbar />
      <div className="container">
        <h2>Welcome, {usernameStored}!</h2> 
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          {/* Search bar */}
          <input
            type="text"
            placeholder="Search by service name in shortlist"
            value={searchServiceName}
            onChange={e => setSearchServiceName(e.target.value)}
            className="search-bar"
          />          
          
        </div>
                
        {/* view services list - Use CustomTable if no actions needed, or CustomTableHomeowner if actions like 'remove' are added here */}
        <div className="search-section">
          <CustomTable // Changed from CustomTableHomeowner if no actions needed on this specific page
            columns={[
              { id: 'cleaningservicename', label: 'Service Name' },
              { id: 'price', label: 'Rate' },
              { id: 'servicecategory', label: 'Service Type' },
              { id: 'cleaningdescription', label: 'Service Description' },
              { id: 'numofviews', label: 'Views' }, // Displaying the authoritative count from cleaningservice
              { id: 'numofshortlist', label: 'Total Shortlists' } // Displaying the authoritative count from cleaningservice
            ]}
            data={serviceList}
            onEdit={openDetailsModal} // Keep if view details modal is desired
            // Remove onShortlist if not applicable here
            // showActions={false} // Hide actions column if not needed
          />
          </div>

        {/* Service Details Modal (Keep if needed) */}
        {showDetailsModal && selectedService && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Cleaning Service Details</h3>
                <button className="close-button" onClick={() => setShowDetailsModal(false)}>×</button>
              </div>
              {/* Display details fetched from the joined data */}
              <div className="form-group"><strong>Cleaner Username:</strong> {selectedService.cleanerusername}</div>
              <div className="form-group"><strong>Service Name:</strong> {selectedService.cleaningservicename}</div>
              <div className="form-group"><strong>Description:</strong> {selectedService.cleaningdescription}</div>
              <div className="form-group"><strong>Service category:</strong> {selectedService.servicecategory}</div>
              <div className="form-group"><strong>Price:</strong> {selectedService.price}</div>
              <div className="modal-footer">
                 {/* Changed Cancel button to close modal directly */}
                <button className="btn btn-cancel" onClick={() => setShowDetailsModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
export default HomeownerShortlistManagementUI;
