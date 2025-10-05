import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/login', formData);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "#f8fafc",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div className="container" style={{ maxWidth: 540, width: "100%", marginTop: "2rem" }}>
        {/* Branding & Info Section */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{
            fontWeight: "900",
            color: "#1e293b",
            fontSize: "2.2rem",
            lineHeight: "120%"
          }}>
            Build Your Professional Brand
          </h1>
          <p style={{ color: "#334155", fontSize: "1.15rem", marginBottom: "1.5rem" }}>
            Create stunning portfolios, optimize your resume, and showcase your skills with professional insights. Stand out in your career with personalized recommendations.
          </p>
        </div>

        {/* Login Form Section */}
        <div style={{
          background: "#fff",
          boxShadow: "0 2px 18px 0 rgba(0,0,0,0.07)",
          borderRadius: "16px",
          padding: "2.5rem 2rem",
          margin: "0 auto 2rem auto",
          maxWidth: "400px"
        }}>
          <div style={{ fontWeight: "700", marginBottom: "0.5rem", fontSize: "1.3rem", textAlign: "center" }}>
            Get Started
          </div>
          <div style={{ fontSize: "0.9rem", color: "#64748b", textAlign: "center", marginBottom: "2rem" }}>
            Create your professional portfolio in minutes
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label" style={{ fontSize: "0.9rem" }}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label className="form-label" style={{ fontSize: "0.9rem" }}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', marginBottom: "1rem", background: "#1e293b" }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-purple)', textDecoration: 'none' }}>Sign up</Link>
          </p>
        </div>

        {/* Features Section */}
        <div>
          <div style={{ textAlign: "center", marginBottom: "0.7rem" }}>
            <span style={{
              background: "#f1eafe",
              color: "#a084e8",
              borderRadius: "6px",
              fontSize: "0.85rem",
              padding: "0.25rem 1rem"
            }}>Features</span>
          </div>
          <h2 style={{ textAlign: "center", fontWeight: 800, fontSize: "1.45rem", marginBottom: "0.4rem" }}>
            Everything You Need to Succeed
          </h2>
          <div style={{ textAlign: "center", color: "#475569", marginBottom: "2rem" }}>
            Our platform combines cutting-edge AI technology with professional design to help you build an outstanding personal brand.
          </div>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.1rem",
            justifyContent: "center"
          }}>
            <FeatureCard
              icon={<span style={{
                padding: '0.6rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white', fontSize: '1.7rem'
              }}>⚡</span>}
              title="AI-Powered Creation"
              desc="Generate compelling portfolios and resumes with advanced AI assistance"
            />
            <FeatureCard
              icon={<span style={{
                padding: '0.6rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #6351ee 100%)',
                color: 'white', fontSize: '1.7rem'
              }}>📊</span>}
              title="Skill Assessment"
              desc="Get personalized recommendations based on your skills and career goals"
            />
            <FeatureCard
              icon={<span style={{
                padding: '0.6rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                color: 'white', fontSize: '1.7rem'
              }}>🤝</span>}
              title="Professional Network"
              desc="Connect with industry professionals and showcase your work"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 1px 5px 0 rgba(0,0,0,0.05)",
      padding: "2rem",
      minWidth: "220px",
      maxWidth: "235px",
      textAlign: "center"
    }}>
      {icon}
      <div style={{ fontWeight: "700", color: "#334155", margin: "1rem 0 0.45rem 0", fontSize: "1.05rem" }}>{title}</div>
      <div style={{ color: "#64748b", fontSize: "0.97rem" }}>{desc}</div>
    </div>
  );
}

export default Login;
