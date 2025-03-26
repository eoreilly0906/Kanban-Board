import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
    };

    // Initial check
    checkAuth();

    // Set up interval to check auth status
    const interval = setInterval(checkAuth, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-title">Krazy Kanban Board</Link>
      </div>
      <div className="navbar-menu">
        {!isAuthenticated ? (
          <Link to="/login" className="navbar-button">
            Login
          </Link>
        ) : (
          <button 
            className="navbar-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
