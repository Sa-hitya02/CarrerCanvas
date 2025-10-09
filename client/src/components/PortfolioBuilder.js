import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PortfolioBuilder() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMessage, setEditMessage] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [project, setProject] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: ''
  });

  // Get API base URL from env
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_URL}/api/portfolio/me`,
          { headers: { 'x-auth-token': token } }
        );
        setPortfolio(response.data);
        setLoading(false);
      } catch (error) {
        setPortfolio(null);
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [API_URL]);

  // Update Basic Info Handler
  const handleBasicInfoChange = (e) => {
    setPortfolio({ ...portfolio, [e.target.name]: e.target.value });
  };

  const handleSaveBasicInfo = async () => {
    setEditMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/portfolio/basic-info`,
        {
          professionalTitle: portfolio.professionalTitle,
          bio: portfolio.bio,
          location: portfolio.location,
          yearsOfExperience: portfolio.yearsOfExperience,
          profilePicture: portfolio.profilePicture
        },
        { headers: { 'x-auth-token': token } }
      );
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
      const response = await axios.post(
        `${API_URL}/api/portfolio/skills`,
        { name: skillName, level: skillLevel },
        { headers: { 'x-auth-token': token } }
      );
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
      const response = await axios.delete(
        `${API_URL}/api/portfolio/skills/${id}`,
        { headers: { 'x-auth-token': token } }
      );
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
      const response = await axios.post(
        `${API_URL}/api/portfolio/projects`,
        {
          ...project,
          technologies: project.technologies.split(',').map(t => t.trim()).filter(Boolean)
        },
        { headers: { 'x-auth-token': token } }
      );
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
      const response = await axios.delete(
        `${API_URL}/api/portfolio/projects/${id}`,
        { headers: { 'x-auth-token': token } }
      );
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
      await axios.put(
        `${API_URL}/api/portfolio/social-links`,
        {
          linkedin: portfolio.socialLinks?.linkedin || '',
          github: portfolio.socialLinks?.github || ''
        },
        { headers: { 'x-auth-token': token } }
      );
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

  if (!portfolio) return (
    <div style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ color: "white", fontSize: "1.2rem" }}>Profile not found or authentication failed!</div>
    </div>
  );

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "1rem",
    marginBottom: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const buttonStyle = {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  };

  const deleteButtonStyle = {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    marginLeft: "0.5rem"
  };

  const sectionStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb"
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      minHeight: "100vh",
      padding: "2rem 0"
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            color: "#1e293b",
            marginBottom: "0.5rem"
          }}>
            Edit Your Portfolio
          </h1>
          <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
            Update your professional information and showcase your skills
          </p>
        </div>

        {/* Success/Error Message */}
        {editMessage && (
          <div style={{
            background: editMessage.includes('❌') ? "#fef2f2" : "#f0fdf4",
            color: editMessage.includes('❌') ? "#dc2626" : "#16a34a",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            border: `1px solid ${editMessage.includes('❌') ? "#fecaca" : "#bbf7d0"}`,
            fontSize: "1rem",
            fontWeight: "500"
          }}>
            {editMessage}
          </div>
        )}

        {/* BASIC INFO */}
        <div style={sectionStyle}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "1.5rem",
            borderBottom: "2px solid #6366f1",
            paddingBottom: "0.5rem",
            display: "inline-block"
          }}>
            📝 Basic Information
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <input
              name="professionalTitle"
              value={portfolio.professionalTitle || ''}
              onChange={handleBasicInfoChange}
              placeholder="Professional Title"
              style={inputStyle}
            />
            <input
              name="location"
              value={portfolio.location || ''}
              onChange={handleBasicInfoChange}
              placeholder="Location"
              style={inputStyle}
            />
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <input
              name="yearsOfExperience"
              type="number"
              value={portfolio.yearsOfExperience || ''}
              onChange={handleBasicInfoChange}
              placeholder="Years of Experience"
              style={inputStyle}
            />
            <input
              name="profilePicture"
              value={portfolio.profilePicture || ''}
              onChange={handleBasicInfoChange}
              placeholder="Profile Picture URL"
              style={inputStyle}
            />
          </div>
          
          <textarea
            name="bio"
            value={portfolio.bio || ''}
            onChange={handleBasicInfoChange}
            placeholder="Tell us about yourself..."
            style={{ ...inputStyle, height: "120px", resize: "vertical" }}
          />
          
          <button onClick={handleSaveBasicInfo} style={buttonStyle}>
            💾 Save Basic Info
          </button>
        </div>

        {/* SKILLS */}
        <div style={sectionStyle}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "1.5rem",
            borderBottom: "2px solid #10b981",
            paddingBottom: "0.5rem",
            display: "inline-block"
          }}>
            ⚡ Skills & Expertise
          </h2>
          
          {/* Current Skills */}
          <div style={{ marginBottom: "2rem" }}>
            {portfolio.skills.length === 0 ? (
              <p style={{ color: "#64748b", fontStyle: "italic" }}>No skills added yet. Add your first skill below!</p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {portfolio.skills.map(skill => (
                  <div key={skill._id || skill.name} style={{
                    background: "linear-gradient(90deg, #e0f2fe 20%, #bae6fd 100%)",
                    border: "1px solid #38bdf8",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <span style={{ fontWeight: "600", color: "#0369a1" }}>
                      {skill.name}
                    </span>
                    <span style={{
                      background: "#0ea5e9",
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "12px",
                      fontSize: "0.75rem",
                      fontWeight: "500"
                    }}>
                      {skill.level}
                    </span>
                    <button
                      onClick={() => handleDeleteSkill(skill._id)}
                      style={deleteButtonStyle}
                      title="Delete skill"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Add New Skill */}
          <form onSubmit={handleAddSkill} style={{
            background: "#f8fafc",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <h4 style={{ marginBottom: "1rem", color: "#1e293b" }}>Add New Skill</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "1rem", alignItems: "end" }}>
              <input
                value={skillName}
                required
                placeholder="Enter skill name"
                onChange={e => setSkillName(e.target.value)}
                style={inputStyle}
              />
              <select
                value={skillLevel}
                onChange={e => setSkillLevel(e.target.value)}
                style={{ ...inputStyle, width: "140px" }}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
              <button type="submit" style={buttonStyle}>
                ➕ Add Skill
              </button>
            </div>
          </form>
        </div>

        {/* PROJECTS */}
        <div style={sectionStyle}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "1.5rem",
            borderBottom: "2px solid #f59e0b",
            paddingBottom: "0.5rem",
            display: "inline-block"
          }}>
            🚀 Featured Projects
          </h2>
          
          {/* Current Projects */}
          <div style={{ marginBottom: "2rem" }}>
            {portfolio.projects.length === 0 ? (
              <p style={{ color: "#64748b", fontStyle: "italic" }}>No projects added yet. Showcase your work below!</p>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {portfolio.projects.map(project => (
                  <div key={project._id || project.title} style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    borderLeft: "4px solid #f59e0b"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                      <h4 style={{ color: "#1e293b", fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
                        {project.title}
                      </h4>
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        style={deleteButtonStyle}
                        title="Delete project"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    <p style={{ color: "#64748b", marginBottom: "0.75rem", lineHeight: "1.5" }}>
                      {project.description}
                    </p>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <span style={{ fontWeight: "600", color: "#374151" }}>Technologies: </span>
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} style={{
                          background: "#fef3c7",
                          color: "#92400e",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                          marginRight: "0.5rem"
                        }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl.startsWith('http') ? project.githubUrl : `https://${project.githubUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#6366f1",
                          textDecoration: "none",
                          fontWeight: "600",
                          fontSize: "0.95rem"
                        }}
                      >
                        🔗 View on GitHub →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Add New Project */}
          <form onSubmit={handleAddProject} style={{
            background: "#f8fafc",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <h4 style={{ marginBottom: "1rem", color: "#1e293b" }}>Add New Project</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <input
                value={project.title}
                onChange={e => setProject(p => ({ ...p, title: e.target.value }))}
                placeholder="Project title"
                required
                style={inputStyle}
              />
              <input
                value={project.githubUrl}
                onChange={e => setProject(p => ({ ...p, githubUrl: e.target.value }))}
                placeholder="GitHub URL (optional)"
                style={inputStyle}
              />
            </div>
            <textarea
              value={project.description}
              onChange={e => setProject(p => ({ ...p, description: e.target.value }))}
              placeholder="Describe your project..."
              required
              style={{ ...inputStyle, height: "100px", resize: "vertical" }}
            />
            <input
              value={project.technologies}
              onChange={e => setProject(p => ({ ...p, technologies: e.target.value }))}
              placeholder="Technologies used (comma separated: React, Node.js, MongoDB)"
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              ➕ Add Project
            </button>
          </form>
        </div>

        {/* SOCIAL LINKS */}
        <div style={sectionStyle}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: "1.5rem",
            borderBottom: "2px solid #8b5cf6",
            paddingBottom: "0.5rem",
            display: "inline-block"
          }}>
            🔗 Social Links
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <input
              value={portfolio.socialLinks?.linkedin || ''}
              onChange={e => setPortfolio({ ...portfolio, socialLinks: { ...portfolio.socialLinks, linkedin: e.target.value } })}
              placeholder="LinkedIn Profile URL"
              style={inputStyle}
            />
            <input
              value={portfolio.socialLinks?.github || ''}
              onChange={e => setPortfolio({ ...portfolio, socialLinks: { ...portfolio.socialLinks, github: e.target.value } })}
              placeholder="GitHub Profile URL"
              style={inputStyle}
            />
          </div>
          
          <button onClick={handleSaveSocialLinks} style={buttonStyle}>
            💾 Save Social Links
          </button>
        </div>
      </div>
    </div>
  );
}

export default PortfolioBuilder;
