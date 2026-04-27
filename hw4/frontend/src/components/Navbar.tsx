import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, loading, refreshAuth } = useAuth();

  const displayName = loading ? 'Loading...' : user?.username || 'Guest';

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await refreshAuth();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">MicRoman</div>
        <Link to="/home" className="nav-item">Home</Link>
      </div>
      <div className="navbar-right">
        {user && (
          <>
            {user.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt="Profile" className="navbar-avatar" />
            ) : (
              <div className="navbar-avatar navbar-avatar-placeholder">{displayName.charAt(0).toUpperCase()}</div>
            )}
            <span className="user-status">Logged in as {displayName}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;