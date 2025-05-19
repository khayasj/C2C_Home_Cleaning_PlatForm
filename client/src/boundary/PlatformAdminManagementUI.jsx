// PlatformAdminManagementUI.jsx

import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import CustomTable from '../components/CustomTable';
import SearchBar from '../components/SearchBar';
import CustomButton from '../components/CustomButton';
import './UAUserProfileManagementUI.css'; // resuse service management css

function PlatformAdminManagementUI() {
  // Get the username from local storage
  const usernameStored = localStorage.getItem('loggedInUser');

  // State variables for form inputs, add servicecategory
  const [servicecategory, setServiceCategory] = useState('');
  const [servicedescription, setServiceDescription] = useState('');

  // Add state for user list and search name
  const [categoryList, setCategoryList] = useState([]);
  const [searchServiceCategory, setSearchServiceCategory] = useState('');

  // Add state for modal visibility, create servicecategory
  const [showModal, setShowModal] = useState(false);

  //add state for servicecategory details modal, view sevice category details
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // edit servicecategory modal
  const [showEditModal, setShowEditModal] = useState(false);


  const openDetailsModal = (category) => {
    setSelectedCategory(category);
    setShowDetailsModal(true);
  };
  
  //for debugging purposes
  console.log('Sending:', {
    servicecategory,
    servicedescription
  });
  
  const createServiceCategory = async () => {
    //for debugging purposes
    console.log("Sending:", {
      servicecategory,
      servicedescription
    }); 

    const res = await fetch('http://localhost:5000/api/servicecategory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ servicecategory, servicedescription }),
    });

    const data = await res.json();
    if (data.success) {
      alert('service category added successfully!');
      setShowModal(false); // Close modal on success
      resetForm(); // Reset form fields
    } else {
      alert('Failed to add service category.');
    }
  };
  
  // Add function to reset form fields
  const resetForm = () => {
    setServiceCategory('');
    setServiceDescription('');
  };
  
  // get all users
  const viewServiceCategory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/servicecategory/all`);
      const data = await res.json();
      setCategoryList(data);
    } catch (err) {
      console.error('Failed to fetch service category:', err);
    }
  };  

  const updateServiceCategory = async (category) => {
    const res = await fetch(`http://localhost:5000/api/servicecategory/${category.servicecategory}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    const data = await res.json();
    if (data.success) {
      alert('service category updated successfully!');
      setSelectedCategory(null);
      viewServiceCategory(); // refresh list
    } else {
      alert('Failed to update service category.');
    }
  };
  
  const deleteServiceCategory = async (servicecategory) => {
    const res = await fetch(`http://localhost:5000/api/servicecategory/${servicecategory}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      alert('service category deleted successfully!');
      setSelectedCategory(null);
      viewServiceCategory(); // refresh list
    } else {
      alert('Failed to delete service category.');
    }
  };
  
  const searchServiceCategoryList = async () => {
    try {
      const query = searchServiceCategory ? `?servicecategory=${searchServiceCategory}` : '';
      const res = await fetch(`http://localhost:5000/api/servicecategory${query}`);
      const data = await res.json();
      setCategoryList(data);
    } catch (err) {
      console.error('Failed to fetch service category:', err);
    }
  };

  useEffect(() => {
    viewServiceCategory(); // fetch all users on page load
  }, []);
  
  useEffect(() => {
    searchServiceCategoryList(); // fetch filtered users when searchName changes
  }, [searchServiceCategory]);

  return( 
  <div>
    <Navbar />
    <div className="container">
      <h2>Welcome, {usernameStored}!</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>

        {/* Search bar */}
        <SearchBar
          placeholder="Search by service category"
          value={searchServiceCategory}
          onChange={e => setSearchServiceCategory(e.target.value)}
        />

        {/* Create button */}
        <CustomButton 
          text="Create New service category" 
          iconPath="src/assets/addAccount.svg"
          onClick={() => setShowModal(true)} 
        />
        
      </div>

      <hr style={{ margin: '0rem' }}></hr>
        
        <CustomTable
          columns={[
            { id: 'servicecategory', label: 'Service Category' },
            { id: 'servicedescription', label: 'Service Description' }
          ]}
          data={categoryList}
          onEdit={openDetailsModal}
        />

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create service category</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="form-group">
              <label>service category</label>
              <input 
                className="form-control"
                placeholder="Enter service category" 
                value={servicecategory} 
                onChange={e => setServiceCategory(e.target.value)} 
              />
            </div>
            
            <div className="form-group">
              <label>description</label>
              <input 
                className="form-control"
                placeholder="Enter description" 
                value={servicedescription} 
                onChange={e => setServiceDescription(e.target.value)} 
              />
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-create" onClick={createServiceCategory}>
                Create service category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showDetailsModal && selectedCategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Service Category Details</h3>
              <button className="close-button" onClick={() => setShowDetailsModal(false)}>×</button>
            </div>
            <div className="form-group"><strong>Service Category:</strong> {selectedCategory.servicecategory}</div>
            <div className="form-group"><strong>Description:</strong> {selectedCategory.servicedescription}</div>
            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setSelectedCategory(null)}>Cancel</button>
              <button className="btn btn-update" onClick={() => {setShowEditModal(true);setShowDetailsModal(false);}}>
                Update service category
              </button>
              <button className="btn btn-delete" onClick={() => deleteServiceCategory(selectedCategory.servicecategory)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit servicecategory Modal */}
      {showEditModal && selectedCategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update service category</h3>
              <button className="close-button" onClick={() => setShowEditModal(false)}>×</button>
            </div>

            {/* Reusable form for editing */}

            <div className="form-group">
              <label>service category</label>
              <input
                className="form-control"
                value={selectedCategory.servicecategory}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                className="form-control"
                value={selectedCategory.servicedescription}
                onChange={e => setSelectedCategory({ ...selectedCategory, servicedescription: e.target.value })}
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn btn-create" onClick={() => {
                updateServiceCategory(selectedCategory);
                setShowEditModal(false);
              }}>
                Update Service Category
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
  </div>
  );
}
export default PlatformAdminManagementUI;
