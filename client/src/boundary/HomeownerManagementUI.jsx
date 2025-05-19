// HomeownerManagementUI.jsx

import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import Navbar from '../components/Navbar';
import CustomTableHomeowner from '../components/CustomTableHomeowner';
import './CleanerServiceManagementUI.css'; // resuse service management css

function HomeownerManagementUI() {
    const usernameStored = localStorage.getItem('loggedInUser');
    const [serviceList, setServiceList] = useState([]);
    const [searchServiceName, setSearchServiceName] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const openDetailsModal = (service) => {
        setSelectedService(service);
        setShowDetailsModal(true);
    };
  
    // View all services, indicating which are shortlisted for the current user
    const viewService = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/homeowner/view?homeownerusername=${usernameStored}`);
            const data = await res.json();
            setServiceList(data);
        } catch (err) {
            console.error('Failed to fetch services:', err);
        }
     };
    
    const searchService = async () => {
        try {
          const query = new URLSearchParams({
            homeownerusername: usernameStored,
            ...(searchServiceName && { cleaningservicename: searchServiceName })
          });
      
          const res = await fetch(`http://localhost:5000/api/homeowner/search?${query}`);
          const data = await res.json();
          setServiceList(data);
        } catch (err) {
          console.error('Failed to fetch services:', err);
        }
      };
      

    useEffect(() => {
        viewService(); // Fetch all services on initial load
    }, []);

    useEffect(() => {
        searchService(); // Search services when search term changes
    }, [searchServiceName]);

    // Handle shortlist toggle action
    const handleShortlistToggle = async (service, isAdding) => {

        const endpoint = isAdding ? '/api/shortlists/add' : '/api/shortlists/remove';
        const method = 'POST';

        try {
            const res = await fetch(`http://localhost:5000${endpoint}`, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    homeownerusername: usernameStored, 
                    cleanerusername: service.cleanerusername, 
                    cleaningservicename: service.cleaningservicename 
                }),
            });            const result = await res.json();            // Always try to update the UI if we have a result, regardless of success flag
            if (result && (result.newShortlistCount !== undefined)) {
                // Update the specific service in the list with the new count and shortlist status
                setServiceList(currentList => 
                    currentList.map(item => {
                        if (item.cleanerusername === service.cleanerusername && item.cleaningservicename === service.cleaningservicename) {
                            return { 
                                ...item, 
                                numofshortlist: result.newShortlistCount, // Use the count from the backend response
                                isShortlisted: isAdding // Update the shortlist status
                            };
                        }
                        return item;
                    })
                );
            } 
        } catch (err) {
            console.error('Failed to toggle shortlist:', err);
            // Refetch data on error to ensure UI consistency
            searchService();
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container">
                <h2>Welcome, {usernameStored}!</h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    {/* Search bar */}
                    <input
                        type="text"
                        placeholder="Search by service name"
                        value={searchServiceName}
                        onChange={e => setSearchServiceName(e.target.value)}
                        className="search-bar"
                    />
                </div>
                

                <div className="search-section">
                    <CustomTableHomeowner
                        columns={[
                            { id: 'cleaningservicename', label: 'Service Name' },
                            { id: 'price', label: 'Rate' },
                            { id: 'servicecategory', label: 'Service Type' },
                            { id: 'cleaningdescription', label: 'Service Description' },
                            { id: 'numofviews', label: 'Views' },
                            { id: 'numofshortlist', label: 'Shortlists' } // This now shows the correct total count
                        ]}
                        data={serviceList}
                        onEdit={openDetailsModal} // For viewing details
                        onShortlist={handleShortlistToggle} // Pass the handler
                        showActions={true} // Show edit/view action button
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
                            <div className="form-group"><strong>Description:</strong> {selectedService.cleaningdescription}</div>
                            <div className="form-group"><strong>Service category:</strong> {selectedService.servicecategory}</div>
                            <div className="form-group"><strong>Price:</strong> {selectedService.price}</div>
                             {/* Add shortlist count and views if desired */}
                             <div className="form-group"><strong>Total Views:</strong> {selectedService.numofviews}</div>
                             <div className="form-group"><strong>Total Shortlists:</strong> {selectedService.numofshortlist}</div>
                            <div className="modal-footer">
                                <button className="btn btn-cancel" onClick={() => setShowDetailsModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomeownerManagementUI;
