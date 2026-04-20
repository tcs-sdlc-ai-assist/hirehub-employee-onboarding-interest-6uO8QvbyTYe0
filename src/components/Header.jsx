import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    const auth = sessionStorage.getItem('hirehub_admin_auth');
    setIsLoggedIn(!!auth);
  }, []);

  useEffect(() => {
    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth]);

  const handleLogout = () => {
    sessionStorage.removeItem('hirehub_admin_auth');
    setIsLoggedIn(false);
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) => ({
    padding: '0.5rem 1rem',
    textDecoration: 'none',
    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
    fontWeight: isActive ? '700' : '500',
    borderBottom: isActive ? '2px solid #ffffff' : '2px solid transparent',
    transition: 'color 0.2s ease, border-bottom 0.2s ease',
    fontSize: '0.95rem',
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        height: '60px',
        backgroundColor: '#1a1a2e',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          color: '#ffffff',
          fontSize: '1.5rem',
          fontWeight: '800',
          letterSpacing: '-0.5px',
        }}
      >
        HireHub
      </Link>

      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <NavLink to="/" end style={navLinkStyle}>
          Home
        </NavLink>
        <NavLink to="/apply" style={navLinkStyle}>
          Apply
        </NavLink>
        <NavLink to="/admin" style={navLinkStyle}>
          Admin
        </NavLink>
      </nav>

      <div>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            style={{
              padding: '0.45rem 1.2rem',
              backgroundColor: 'transparent',
              color: '#ffffff',
              border: '1.5px solid rgba(255, 255, 255, 0.6)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
            }}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/admin"
            style={{
              padding: '0.45rem 1.2rem',
              backgroundColor: '#e94560',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d63851';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e94560';
            }}
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;