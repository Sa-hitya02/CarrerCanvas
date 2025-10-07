import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PortfolioBuilder() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMessage, setEditMessage] = useState('');

  // For skill form
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('Beginner');

  // For project form
  const [project, setProject] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: ''
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/portfolio/me', {
          headers: { 'x-auth-token': token }
        });
        setPortfolio(response.data);
        setLoading(false);
      } catch (error) {
        setPortfolio(null);
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  // --- NEW FUNCTION: Create New Portfolio ---
  const handleCreatePortfolio = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/portfolio', {}, {
        headers: { 'x-auth-token': token }
      });
      setPortfolio(response.data);
      setLoading(false);
      setEditMessage('✅ Portfolio created! Start editing your profile.');
      setTimeout(() => setEditMessage(''), 3000);
    } catch (error) {
      setLoading(false);
      setEditMessage('❌ Failed to create portfolio, please try again!');
      setTimeout(() => setEditMessage(''), 3000);
    }
  };
  // ------------------------------------------

  // Update Basic Info Handler
  const handleBasicInfoChange = (e) => {
    setPortfolio({ ...portfolio, [e.target.name]: e.target.value });
  };

  const handleSaveBasicInfo = async () => {
    setEditMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/portfolio/basic-info', {
        professionalTitle: portfolio.professionalTitle,
        bio: portfolio.bio,
        location: portfolio.location,
        yearsOfExperience: portfolio.yearsOfExperience,
        profilePicture: portfolio.profilePicture
      }, { headers: { 'x-auth-token': token } });
      setEditMessage('✅ Profile updated successfully!');
      setTimeout(() => setEditMessage(''), 3000);
    } catch {
      setEditMessage('❌ Failed to update profile.');
    }
  };

  // Add Skill Handler
  const handleAddSkill = async (e) => {
    e.preventDefault();
    setEditMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/portfolio/skills', {
        name: skillName,
        level: skillLevel
      }, { headers: { 'x-auth-token': token } });
      setPortfolio({ ...portfolio, skills: response.data });
      setSkillName('');
      setSkillLevel('Beginner');
      setEditMessage('✅ Skill added successfully!');
      setTimeout(() => setEditMessage(''), 3000);
    } catch {
      setEditMessage('❌ Failed to add skill.');
    }
  };

  // Remove Skill
  const handleDeleteSkill = async (id) => {
    setEditMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/api/portfolio/skills/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setPortfolio({ ...portfolio, skills: response.data });
      setEditMessage('✅ Skill deleted!');
      setTimeout(() => setEditMessage(''), 3000);
    } catch {
      setEditMessage('❌ Failed to delete skill.');
    }
  };

  // Add Project Handler
  const handleAddProject = async (e) => {
    e.preventDefault();
    setEditMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/portfolio/projects', {
        ...project,
        technologies: project.technologies.split(',').map(t => t.trim()).filter(Boolean)
      }, { headers: { 'x-auth-token': token } });
      setPortfolio({ ...portfolio, projects: response.data });
      setProject({ title: '', description: '', technologies: '', githubUrl: '' });
      setEditMessage('✅ Project added successfully!');
      setTimeout(() => setEditMessage(''), 3000);
    } catch {
      setEditMessage('❌ Failed to add project.');
    }
  };

  // Remove Project
  const handleDeleteProject = async (id) => {
    setEditMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`/api/portfolio/projects/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setPortfolio({ ...portfolio, projects: response.data });
      setEditMessage('✅ Project deleted!');
      setTimeout(() => setEditMessage(''), 3000);
    } catch {
      setEditMessage('❌ Failed to delete project.');
    }
  };

  // Update Social Links
  const handleSaveSocialLinks = async () => {
    setEditMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/portfolio/social-links', {
        linkedin: portfolio.socialLinks?.linkedin || '',
        github: portfolio.socialLinks?.github || ''
      }, { headers: { 'x-auth-token': token } });
      setEditMessage('✅ Social links updated!');
      setTimeout(() => setEditMessage(''), 3000);
    } catch {
      setEditMessage('❌ Failed to update social links.');
    }
  };

  if (loading) return (
    <div style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ color: "white", fontSize: "1.2rem" }}>Loading your portfolio...</div>
    </div>
  );

  // --- UPDATED: Show create portfolio button instead of error ---
  if (!portfolio) return (
    <div style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ color: "white", fontSize: "1.2rem", textAlign: 'center' }}>
        No portfolio found!<br />
        <button
          style={{
            marginTop: "2rem",
            padding: "0.8rem 2rem",
            borderRadius: "8px",
            fontWeight: "700",
            fontSize: "1rem",
            cursor: "pointer",
            background: "#6366f1",
            color: "#fff",
            border: "none"
          }}
          onClick={handleCreatePortfolio}
        >
          + Create New Portfolio
        </button>
        {editMessage && (
          <div style={{
            marginTop: "2rem",
            background: editMessage.includes('❌') ? "#fef2f2" : "#f0fdf4",
            color: editMessage.includes('❌') ? "#dc2626" : "#16a34a",
            padding: "1rem",
            borderRadius: "8px",
            border: `1px solid ${editMessage.includes('❌') ? "#fecaca" : "#bbf7d0"}`,
            fontSize: "1rem",
            fontWeight: "500"
          }}>
            {editMessage}
          </div>
        )}
      </div>
    </div>
  );
  // ----------------------------------------------

  // ... keep the rest of your code unchanged

  // (your style objects and return as before)
  // rest of the component code here

}

export default PortfolioBuilder;
