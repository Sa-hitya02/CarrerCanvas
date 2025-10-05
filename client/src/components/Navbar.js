import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="nav-content">
                    <Link to={user ? "/dashboard" : "/"} className="logo">
                        <div className="logo-icon">C</div>
                        CareerCanvas
                    </Link>
                    
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                        {user ? (
                            <>
                                <Link to="/dashboard" style={{color: '#64748b', textDecoration: 'none'}}>
                                    Dashboard
                                </Link>
                                <Link to="/builder" style={{color: '#64748b', textDecoration: 'none'}}>
                                    Builder
                                </Link>
                                <span style={{color: '#64748b'}}>
                                    Hello, {user.name}
                                </span>
                                <button 
                                    onClick={handleLogout}
                                    style={{
                                        background: 'none',
                                        border: '1px solid #e5e7eb',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        color: '#64748b'
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{color: '#64748b', textDecoration: 'none'}}>
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary" style={{textDecoration: 'none'}}>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
