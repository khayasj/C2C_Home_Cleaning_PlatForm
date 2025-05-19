import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import CustomTable from '../components/CustomTable';
import './UAUserProfileManagementUI.css';
import SearchBar from '../components/SearchBar';
import CustomButton from '../components/CustomButton';

function UAUserProfileManagementUI() {
  // Get the username from local storage
  const usernameStored = localStorage.getItem('loggedInUser');

  // State variables for form inputs, add profile
  const [profilename, setProfileName] = useState('');
  const [profiletype, setProfileType] = useState('');
  const [profiledescription, setProfileDescription] = useState('');

  // Add state for user list and search name
  const [profileList, setProfileList] = useState([]);
  const [searchProfileName, setSearchProfileName] = useState('');

  // Add state for modal visibility, create profile
  const [showModal, setShowModal] = useState(false);

  //add state for user details modal, view user details
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // edit user
  const [showEditModal, setShowEditModal] = useState(false);


  const openDetailsModal = (profile) => {
    setSelectedProfile(profile);
    setShowDetailsModal(true);
  };
  
  //for debugging purposes
  console.log('Sending:', {
    profilename,
    profiledescription
  });
  
  const createUserProfile = async () => {
    //for debugging purposes
    console.log("Sending:", {
      profilename,
      profiletype,
      profiledescription
    }); 

    const res = await fetch('http://localhost:5000/api/profiles/profilenames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profilename, profiletype, profiledescription }),
    });

    const data = await res.json();
    if (data.success) {
      alert('Profile added successfully!');
      setShowModal(false); // Close modal on success
      resetForm(); // Reset form fields
    } else {
      alert('Failed to add profile.');
    }
  };
  
  // Add function to reset form fields
  const resetForm = () => {
    setProfileName('');
    setProfileType('');
    setProfileDescription('');
  };
  
  // get all users
  const viewUserProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/profiles/view`);
      const data = await res.json();
      setProfileList(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };  

  const updateUserProfile = async (profile) => {
    const res = await fetch(`http://localhost:5000/api/profiles/${profile.profilename}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (data.success) {
      alert('Profile updated successfully!');
      setSelectedProfile(null);
      viewUserProfile(); // refresh list
    } else {
      alert('Failed to update profile.');
    }
  };
  
  const deleteUserProfile = async (profilename) => {
    const res = await fetch(`http://localhost:5000/api/profiles/${profilename}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      alert('Profile deleted successfully!');
      setSelectedProfile(null);
      viewUserProfile(); // refresh list
    } else {
      alert('Failed to delete profile.');
    }
  };
  
  const searchUserProfile = async () => {
    try {
      const query = searchProfileName ? `?profilename=${searchProfileName}` : '';
      const res = await fetch(`http://localhost:5000/api/profiles/profilenames${query}`);
      const data = await res.json();
      setProfileList(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  useEffect(() => {
    viewUserProfile(); // fetch all users on page load
  }, []);
  
  useEffect(() => {
    searchUserProfile(); // fetch filtered users when searchName changes
  }, [searchProfileName]);
  
  return (
    <div>                

      <Navbar />
      <div className="container">
        <h2>Welcome, {usernameStored}!</h2>  

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>

          {/* Search bar */}
          <SearchBar
            placeholder="Search by profile name"
            value={searchProfileName}
            onChange={e => setSearchProfileName(e.target.value)}
          />

          {/* Create button */}
          <CustomButton 
            text="Create New Profile" 
            iconPath="src/assets/addAccount.svg"
            onClick={() => setShowModal(true)} 
          />
          
        </div>

        <hr style={{ margin: '0rem' }}></hr>
          
          <CustomTable
            columns={[
              { id: 'profilename', label: 'Profile Name' },
              { id: 'profiletype', label: 'Profile Type' }
            ]}
            data={profileList}
            onEdit={openDetailsModal}
          />

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Create Profile</h3>
                <button className="close-button" onClick={() => setShowModal(false)}>×</button>
              </div>
              
              <div className="form-group">
                <label>Profile Name</label>
                <input 
                  className="form-control"
                  placeholder="Enter profile name" 
                  value={profilename} 
                  onChange={e => setProfileName(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label>Profile Type</label>
                <select 
                  className="form-control"
                  value={profiletype}
                  onChange={e => setProfileType(e.target.value)}
                >
                  <option value="">Select Profile Type</option>
                  <option value="useradmin">User Admin</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="homeowner">Homeowner</option>
                  <option value="platformadmin">Platform Admin</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>description</label>
                <input 
                  className="form-control"
                  placeholder="Enter first name" 
                  value={profiledescription} 
                  onChange={e => setProfileDescription(e.target.value)} 
                />
              </div>
              
              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-create" onClick={createUserProfile}>
                  Create Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showDetailsModal && selectedProfile && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>User profile Details</h3>
                <button className="close-button" onClick={() => setShowDetailsModal(false)}>×</button>
              </div>
              <div className="form-group"><strong>Profile Name:</strong> {selectedProfile.profilename}</div>
              <div className="form-group"><strong>Profile Type:</strong> {selectedProfile.profiletype}</div>
              <div className="form-group"><strong>Description:</strong> {selectedProfile.profiledescription}</div>
              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => setSelectedProfile(null)}>Cancel</button>
                <button className="btn btn-update" onClick={() => {setShowEditModal(true);setShowDetailsModal(false);}}>
                  Update Profile
                </button>
                <button className="btn btn-delete" onClick={() => deleteUserProfile(selectedProfile.profilename)}>Delete</button>
              </div>
            </div>
          </div>
        )}
        
        {/* Edit Profile Modal */}
        {showEditModal && selectedProfile && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Update User Profile</h3>
                <button className="close-button" onClick={() => setShowEditModal(false)}>×</button>
              </div>

              {/* Reusable form for editing */}

              <div className="form-group">
                <label>Profile Name</label>
                <input
                  className="form-control"
                  value={selectedProfile.profilename}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Profile Type</label>
                <select
                  className="form-control"
                  value={selectedProfile.profiletype}
                  onChange={e => setSelectedProfile({ ...selectedProfile, profiletype: e.target.value })}
                >
                  <option value="">Select Profile Type</option>
                  <option value="useradmin">User Admin</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="homeowner">Homeowner</option>
                  <option value="platformadmin">Platform Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  className="form-control"
                  value={selectedProfile.profiledescription}
                  onChange={e => setSelectedProfile({ ...selectedProfile, profiledescription: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-create" onClick={() => {
                  updateUserProfile(selectedProfile);
                  setShowEditModal(false);
                }}>
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

export default UAUserProfileManagementUI;
