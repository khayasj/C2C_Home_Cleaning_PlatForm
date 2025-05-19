import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import CustomButton from '../components/CustomButton';
import SearchBar from '../components/SearchBar';
import CustomTable from '../components/CustomTable';
import './UAUserAccountManagementUI.css'; // Import the CSS file

function UAUserAccountManagementUI() {
  // Get the username from local storage
  const usernameStored = localStorage.getItem('loggedInUser');

  // State variables for profile options
  const [profileOptions, setProfileOptions] = useState([]);

  // State variables for form inputs, add user
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilename, setProfileName] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Add state for user list and search name
  const [userList, setUserList] = useState([]);
  const [searchName, setSearchName] = useState('');

  // Add state for modal visibility, create user
  const [showModal, setShowModal] = useState(false);

  //add state for user details modal, view user details
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // edit user
  const [showEditModal, setShowEditModal] = useState(false);


  const openDetailsModal = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };
  
  //for debugging purposes
  console.log('Sending:', {
    username,
    password,
    profilename,
    firstname,
    lastname,
    email,
    phone
  });
  
  const createUserAccount = async () => {
    const res = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, profilename, firstname, lastname, email, phone }),
    });

    const data = await res.json();
    if (data.success) {
      alert('User added successfully!');
      setShowModal(false); // Close modal on success
      resetForm(); // Reset form fields
    } else {
      alert('User account already exist.');
    }
  };
  
  // Add function to reset form fields
  const resetForm = () => {
    setUsername('');
    setPassword('');
    setProfileName('');
    setFirstname('');
    setLastname('');
    setEmail('');
    setPhone('');
  };
  
  // get all users
  const viewUserAccount = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/all`);
      const data = await res.json();
      setUserList(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };  

  const updateUserAccount = async (user) => {
    const res = await fetch(`http://localhost:5000/api/users/${user.username}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    if (data.success) {
      alert('User updated successfully!');
      setSelectedUser(null);
      viewUserAccount(); // refresh list
    } else {
      alert('Failed to update user.');
    }
  };
  
  const deleteUserAccount = async (username) => {
    const res = await fetch(`http://localhost:5000/api/users/${username}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success) {
      alert('User deleted successfully!');
      setSelectedUser(null);
      viewUserAccount(); // refresh list
    } else {
      alert('Failed to delete user.');
    }
  };
  
  const searchUserAccount = async () => {
    try {
      const query = searchName ? `?firstname=${searchName}` : '';
      const res = await fetch(`http://localhost:5000/api/users${query}`);
      const data = await res.json();
      setUserList(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    viewUserAccount(); // fetch all users on page load
  }, []);
  
  useEffect(() => {
    searchUserAccount(); // fetch filtered users when searchName changes
  }, [searchName]);
  
  useEffect(() => {
    const fetchProfileNames = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/profiles/profilenames');
        const data = await res.json();
        // Extract unique profile names
        // and create an array of objects
        const uniqueProfiles = Array.from(new Set(data.map(p => p.profilename)))
          .map(name => ({ profilename: name }));
        setProfileOptions(uniqueProfiles);
      } catch (err) {
        console.error('Error fetching profile name:', err);
      }
    };
  
    fetchProfileNames();
  }, []);
  

  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Welcome, {usernameStored}!</h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>

          {/* Search bar */}
          <SearchBar
            placeholder="Search by first name"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />

          {/* Create button */}
          <CustomButton 
            text="Create New Account" 
            iconPath="src/assets/addAccount.svg"
            onClick={() => setShowModal(true)} 
          />
          
        </div>

        <hr style={{ margin: '0rem' }}></hr>
        
          <CustomTable
            columns={[
              { id: 'firstname', label: 'First Name' },
              { id: 'lastname', label: 'Last Name' },
              { id: 'username', label: 'Username' },
              { id: 'profilename', label: 'Profile' }
            ]}
            data={userList}
            onEdit={openDetailsModal}
          />

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Create Account</h3>
                <p>Enter details to set up a new user account</p>
                <button className="close-button" onClick={() => setShowModal(false)}>×</button>
              </div>
              
              <div className="form-group">
                <label>Username</label>
                <input 
                  className="form-control"
                  placeholder="Enter username" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input 
                  className="form-control"
                  type="password" 
                  placeholder="Enter password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label>First Name</label>
                <input 
                  className="form-control"
                  placeholder="Enter first name" 
                  value={firstname} 
                  onChange={e => setFirstname(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label>Last Name</label>
                <input 
                  className="form-control"
                  placeholder="Enter last name" 
                  value={lastname} 
                  onChange={e => setLastname(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input 
                  className="form-control"
                  placeholder="Enter email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  className="form-control"
                  placeholder="Enter phone number" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Profile Name</label>
                <select 
                  className="form-control"
                  value={profilename}
                  onChange={e => setProfileName(e.target.value)}
                >
                  <option value="">Select Type</option>
                  {profileOptions.map((type) => (
                    <option key={type.profilename} value={type.profilename}>
                      {type.profilename.charAt(0).toUpperCase() + type.profilename.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-create" onClick={createUserAccount}>
                  Create Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showDetailsModal && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>User Account Details</h3>
                <button className="close-button" onClick={() => setShowDetailsModal(false)}>×</button>
              </div>
              <div className="form-group"><strong>Profile:</strong> {selectedUser.profilename}</div>
              <div className="form-group"><strong>Username:</strong> {selectedUser.username}</div>
              <div className="form-group"><strong>First Name:</strong> {selectedUser.firstname}</div>
              <div className="form-group"><strong>Last Name:</strong> {selectedUser.lastname}</div>
              <div className="form-group"><strong>Phone:</strong> {selectedUser.phone}</div>
              <div className="form-group"><strong>Email:</strong> {selectedUser.email}</div>
              <div className="form-group">
                <strong>Password:</strong>{' '}
                {showPassword ? selectedUser.password : '••••••••'}
                <button 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="toggle-password"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => setSelectedUser(null)}>Cancel</button>
                <button className="btn btn-update" onClick={() => {setShowEditModal(true);setShowDetailsModal(false);}}>
                  Update Account
                </button>
                <button className="btn btn-delete" onClick={() => deleteUserAccount(selectedUser.username)}>Delete</button>
              </div>
            </div>
          </div>
        )}
        
        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Update User Account</h3>
                <button className="close-button" onClick={() => setShowEditModal(false)}>×</button>
              </div>

              {/* Reusable form for editing */}
              <div className="form-group">
                <label>Profile</label>
                <select className="form-control" value={selectedUser.profilename} onChange={e => setSelectedUser({ ...selectedUser, profilename: e.target.value })}>
                  <option value="">Select Type</option>
                  {profileOptions.map((type) => (
                    <option key={type.profilename} value={type.profilename}>
                      {type.profilename.charAt(0).toUpperCase() + type.profilename.slice(1)}
                    </option>
                  ))}
                </select>

              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  className="form-control"
                  value={selectedUser.username}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>First Name</label>
                <input
                  className="form-control"
                  value={selectedUser.firstname}
                  onChange={e => setSelectedUser({ ...selectedUser, firstname: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  className="form-control"
                  value={selectedUser.lastname}
                  onChange={e => setSelectedUser({ ...selectedUser, lastname: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  className="form-control"
                  value={selectedUser.phone}
                  onChange={e => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  className="form-control"
                  value={selectedUser.email}
                  onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  className="form-control"
                  value={selectedUser.password}
                  onChange={e => setSelectedUser({ ...selectedUser, password: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-create" onClick={() => {
                  updateUserAccount(selectedUser);
                  setShowEditModal(false);
                }}>
                  Update Account
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default UAUserAccountManagementUI;
