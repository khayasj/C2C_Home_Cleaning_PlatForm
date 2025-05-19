import { useState } from 'react';
import PropTypes from 'prop-types';

function LoginContainer({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileType, setProfileType] = useState('');

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    onLogin(username, password, profileType);
  };

  const loginContainerStyle = {
    maxWidth: '550px',
    margin: '40px auto',
    marginTop: '80px',
    padding: '40px',
    paddingTop: '110px',
    borderRadius: '25px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    border: '1px solid var(--primary-color)',
    backgroundColor: 'white'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '20px'
  };

  const welcomeStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    color: '#666',
    marginBottom: '30px'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid var(--gray)',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const primaryButtonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#222',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '10px',
    fontWeight: 'bold'
  };

  const secondaryButtonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: 'white',
    color: '#222',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  return (
    <div style={loginContainerStyle}>
      <div style={headerStyle}>
        <div style={welcomeStyle}>Welcome Back 👋</div>
        <div style={subtitleStyle}>Sign in to get started</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Username</label>
          <input
            data-testid="username"
            style={inputStyle}
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Password</label>
          <input
            data-testid="password"
            style={inputStyle}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>User Type</label>
          <select
            data-testid="profileType"
            style={inputStyle}
            value={profileType}
            onChange={e => setProfileType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="cleaner">Cleaner</option>
            <option value="useradmin">User Admin</option>
            <option value="homeowner">Homeowner</option>
            <option value="platformadmin">Platform Admin</option>
          </select>
        </div>

        <button type="submit" style={primaryButtonStyle}>Log In</button>
      </form>
    </div>
  );
}

LoginContainer.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default LoginContainer;
