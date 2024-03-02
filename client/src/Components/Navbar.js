import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import AuthContext

const Navbar = () => {
    const { user, logout } = useAuth(); // Get user authentication status and logout function

    const handleLogout = () => {
        // Call the logout function
        logout();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#008080' }}>
            <div className="container">
                <Link className="navbar-brand" to="/">LargeEvents</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {/* Conditional rendering based on authentication status */}
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                                </li>
                                {user.role === 'admin' && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/createevent">Create Event</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/createtask">Add Task</Link>
                                        </li>
                                    </>
                                )}
                                <li className="nav-item">
                                    <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
