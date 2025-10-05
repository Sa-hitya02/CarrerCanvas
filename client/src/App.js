import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PortfolioBuilder from './components/PortfolioBuilder';
import PublicPortfolio from './components/PublicPortfolio';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/builder" element={
              <PrivateRoute>
                <PortfolioBuilder />
              </PrivateRoute>
            } />
            {/* Public portfolio route - no authentication required */}
            <Route path="/portfolio/:userId" element={<PublicPortfolio />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
