import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import CustomButton from '../components/CustomButton';
import CustomTable from '../components/CustomTable';
import './CleanerServiceManagementUI.css'; // Import the CSS file

function CleanerServiceManagementUI() {
  // Get the cleaningservicename from local storage
  const usernameStored = localStorage.getItem('loggedInUser');
  // State variables for profile options
  const [categoryOptions, setCategoriesOptions] = useState([]);

  // State variables for form inputs, add service
  const [cleaningservicename, setCleaningServiceName] = useState('');
  const [cleanerusername, setCleanerUsername] = useState('');
  const [servicecategory, setServiceCategory] = useState('');
  const [cleaningdescription, setCleaningDescription] = useState('');
  const [price, setPrice] = useState('');

  // Add state for service list and search name
  const [serviceList, setServiceList] = useState([]);
  const [searchServiceName, setSearchServiceName] = useState('');

  // Add state for modal visibility, create service
  const [showModal, setShowModal] = useState(false);

  //add state for service details modal, view service details
  const [selectedService, setSelectedService] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // edit service
  const [showEditModal, setShowEditModal] = useState(false);


  const openDetailsModal = (service) => {
    setSelectedService(service);
    setShowDetailsModal(true);
  };
  
  //for debugging purposes
  console.log('Sending:', {
    cleaningservicename,
    cleanerusername,
    servicecategory,
    cleaningdescription,
    price
  });
  
  const createService = async () => {
    const res = await fetch('http://localhost:5000/api/cleaner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cleaningservicename, cleanerusername, servicecategory, cleaningdescription, price }),
    });

    const data = await res.json();
    if (data.success) {
      alert('Service added successfully!');
      setShowModal(false); // Close modal on success
      resetForm(); // Reset form fields
    } else {
      alert('Service already exist or invalid fields.');
    }
  };
  
  // Add function to reset form fields
  const resetForm = () => {
    setCleaningServiceName('');
    setCleanerUsername('');
    setServiceCategory('');
    setCleaningDescription('');
    setPrice('');
  };
  
  // get all services
  const viewService = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/cleaner/all/${usernameStored}`);
      const data = await res.json();
      setServiceList(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };
  
  

  const updateService = async (service) => {
    const res = await fetch(`http://localhost:5000/api/cleaner/${service.cleanerusername}/${service.cleaningservicename}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service),
    });
    const data = await res.json();
    if (data.success) {
      alert('Service updated successfully!');
      setSelectedService(null);
      viewService(); // refresh list
    } else {
      alert('Failed to update service.');
    }
  };
  
  const deleteService = async (cleanerusername, cleaningservicename) => {
    const res = await fetch(`http://localhost:5000/api/cleaner/${cleanerusername}/${cleaningservicename}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      alert('Service deleted successfully!');
      setSelectedService(null);
      viewService(); // refresh list
    } else {
      alert('Failed to delete service.');
    }
  };

    // search services
    const searchService = async () => {
      try {
        const query = searchServiceName ? `?cleaningservicename=${searchServiceName}` : '';
        const res = await fetch(`http://localhost:5000/api/cleaner/${usernameStored}${query}`);
        const data = await res.json();
        setServiceList(data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    }

  useEffect(() => {
    viewService(); // fetch all services on page load
  }, []);
  
  useEffect(() => {
    searchService(); // fetch filtered services when searchServiceName changes
  }, [searchServiceName]);
  
  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/servicecategory');
        const data = await res.json();
        // Extract unique profile names
        // and create an array of objects
        const uniqueCategories = Array.from(new Set(data.map(sc => sc.servicecategory)))
          .map(name => ({ servicecategory: name }));
        setCategoriesOptions(uniqueCategories);
      } catch (err) {
        console.error('Error fetching category name:', err);
      }
    };
  
    fetchServiceCategories();
  }, []);
  
  // setCleanerUsername from local storage so that create service can use it
  useEffect(() => {
    const stored = localStorage.getItem('loggedInUser');
    setCleanerUsername(stored || ''); // <-- Set it here also
  }, []);

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
          
          {/* Create button */}
          <CustomButton 
            text="Create New Service" 
            iconPath="src/assets/addAccount.svg"
            onClick={() => setShowModal(true)} 
          />
          
        </div>
        
        {/* view services list */}
        <div className="search-section">
          <CustomTable
            columns={[
              { id: 'cleaningservicename', label: 'Service Name' },
              { id: 'price', label: 'Rate' },
              { id: 'servicecategory', label: 'Service Type' },
              { id: 'cleaningdescription', label: 'Service Description' },
              { id: 'numofviews', label: 'Views' },
              { id: 'numofshortlist', label: 'Shortlists' }
            ]}
            data={serviceList}
            onEdit={openDetailsModal}
          />
        </div>


        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Create Service</h3>
                <p>Enter details to set up a new cleaning service</p>
                <button className="close-button" onClick={() => setShowModal(false)}>×</button>
              </div>
              
              <div className="form-group">
                <label>Service Name</label>
                <input 
                  className="form-control"
                  placeholder="Enter cleaning service name" 
                  value={cleaningservicename} 
                  onChange={e => setCleaningServiceName(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label>Cleaner Username</label>
                <input 
                  className="form-control"
                  placeholder={usernameStored} 
                  value={cleanerusername} 
                  disabled 
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <input 
                  className="form-control"
                  placeholder="Enter description" 
                  value={cleaningdescription} 
                  onChange={e => setCleaningDescription(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label>Price</label>
                <input 
                  className="form-control"
                  placeholder="Enter price" 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Service Category</label>
                <select 
                  className="form-control"
                  value={servicecategory}
                  onChange={e => setServiceCategory(e.target.value)}
                >
                  <option value="">Select Type</option>
                  {categoryOptions.map((type) => (
                    <option key={type.servicecategory} value={type.servicecategory}>
                      {type.servicecategory.charAt(0).toUpperCase() + type.servicecategory.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-create" onClick={createService}>
                  Create Cleaning Service
                </button>
              </div>
            </div>
          </div>
        )}

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
              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => setSelectedService(null)}>Cancel</button>
                <button className="btn btn-update" onClick={() => {setShowEditModal(true);setShowDetailsModal(false);}}>
                  Update Service
                </button>
                <button className="btn btn-delete" onClick={() => deleteService(selectedService.cleanerusername,selectedService.cleaningservicename)}>Delete</button>
              </div>
            </div>
          </div>
        )}
        
        {/* Edit Service Modal */}
        {showEditModal && selectedService && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Update Cleaning Service</h3>
                <button className="close-button" onClick={() => setShowEditModal(false)}>×</button>
              </div>

              {/* Reusable form for editing */}
              <div className="form-group">
                <label>Service Category</label>
                <select className="form-control" value={selectedService.servicecategory} onChange={e => setSelectedService({ ...selectedService, servicecategory: e.target.value })}>
                  <option value="">Select Type</option>
                  {categoryOptions.map((type) => (
                    <option key={type.servicecategory} value={type.servicecategory}>
                      {type.servicecategory.charAt(0).toUpperCase() + type.servicecategory.slice(1)}
                    </option>
                  ))}
                </select>

              </div>

              <div className="form-group">
                <label>Service Name</label>
                <input
                  className="form-control"
                  value={selectedService.cleaningservicename}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  className="form-control"
                  value={selectedService.cleanerusername}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  className="form-control"
                  value={selectedService.cleaningdescription}
                  onChange={e => setSelectedService({ ...selectedService, cleaningdescription: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  className="form-control"
                  value={selectedService.price}
                  onChange={e => setSelectedService({ ...selectedService, price: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-create" onClick={() => {
                  updateService(selectedService);
                  setShowEditModal(false);
                }}>
                  Update Service
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
    );
  }
export default CleanerServiceManagementUI;
