// Logout.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Logout = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    // Perform logout actions
    logout();
  };

  return (
    <li>
      <NavLink to=" " className="nav-link" onClick={handleLogout}>
        Logout
      </NavLink>
    </li>
  );
};

export default Logout;
