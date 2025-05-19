import { useNavigate } from 'react-router-dom';
import LoginContainer from '../components/LoginContainer';

function LoginUI() {
  const navigate = useNavigate();
  const handleLogin = async (username, password, profileType) => {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, profileType }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem('loggedInUser', username);
      
      // Map profile type to userType for Navbar
      let userType;
      switch (profileType.toLowerCase()) {
        case 'useradmin':
          userType = 'admin';
          break;
        case 'homeowner':
          userType = 'homeowner';
          break;
        case 'cleaner':
          userType = 'cleaner';
          break;
        case 'platformadmin':
          userType = 'platformAdmin';
          break;
        default:
          userType = 'user';
      }
      
      // Store user type in localStorage
      localStorage.setItem('userType', userType);
      alert('Login successful!');

      switch (profileType.toLowerCase()) {
        case 'useradmin':
          navigate('/accountmanagement');
          break;
        case 'homeowner':
          navigate('/homeowner');
          break;
        case 'cleaner':
          navigate('/cleaner');
          break;
        case 'platformadmin':
          navigate('/platformadmin');
          break;
        default:
          alert('Unknown profile type');
      }
    } else {
      alert('Login failed.');
    }
  };

  return (
    <LoginContainer onLogin={handleLogin} />
  );
}

export default LoginUI;
