import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/portfolio/me`, {
         headers: { 'x-auth-token': token }
      });
      setPortfolio(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!portfolio) return 0;
    let progress = 0;
    if (portfolio.professionalTitle) progress += 20;
    if (portfolio.bio) progress += 20;
    if (portfolio.location) progress += 10;
    if (portfolio.yearsOfExperience > 0) progress += 10;
    if (portfolio.skills.length > 0) progress += 20;
    if (portfolio.projects.length > 0) progress += 20;
    return progress;
  };

  const isEmptyPortfolio = () => {
    if (!portfolio) return true;
    return !portfolio.professionalTitle &&
      !portfolio.bio &&
      portfolio.skills.length === 0 &&
      portfolio.projects.length === 0;
  };

  const handleViewPublicPortfolio = () => {
    if (!portfolio || !portfolio._id) {
      alert('Please complete your portfolio first!');
      return;
    }
    window.open(`/portfolio/${portfolio._id}`, '_blank');
  };

  const handleSharePortfolio = () => {
    if (!portfolio || !portfolio._id) {
      alert('Please complete your portfolio first!');
      return;
    }
    const portfolioUrl = `${window.location.origin}/portfolio/${portfolio._id}`;
    navigator.clipboard.writeText(portfolioUrl).then(() => {
      alert('Portfolio link copied to clipboard!');
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = portfolioUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Portfolio link copied to clipboard!');
    });
  };

  const handleDownloadPortfolio = () => {
    if (!portfolio || !portfolio._id) {
      alert('Please complete your portfolio first!');
      return;
    }
    const portfolioContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>${portfolio.name || user?.name}'s Professional Portfolio</title>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 2rem; color: #333; }
            .container { max-width: 900px; margin: 0 auto; background: #ffffff; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; }
            .hero { background: #22223b; color: white; padding: 3rem 2rem; text-align: center; position: relative; }
            .hero-content { position: relative; z-index: 1; }
            .avatar { width: 140px; height: 140px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; border: 4px solid rgba(255,255,255,0.3); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
            h1 { font-weight: 800; font-size: 2.5rem; margin-bottom: 0.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .title { font-size: 1.3rem; margin-bottom: 1rem; opacity: 0.95; font-weight: 500; }
            .meta { font-size: 1rem; opacity: 0.9; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; }
            .content { padding: 2.5rem; }
            .section { margin-bottom: 3rem; }
            .section h2 { font-size: 1.75rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem; border-bottom: 3px solid #6366f1; padding-bottom: 0.5rem; display: inline-block; }
            .about-text { color: #475569; font-size: 1.1rem; line-height: 1.7; background: #f8fafc; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0; }
            .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
            .skill-item { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #bae6fd; border-radius: 12px; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .skill-name { font-weight: 600; font-size: 1rem; color: #0c4a6e; }
            .skill-level { background: #0ea5e9; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem; font-weight: 500; }
            .projects h2 { border-bottom-color: #f59e0b; }
            .project { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin-bottom: 1.5rem; border-left: 4px solid #f59e0b; }
            .project h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.75rem; color: #1e293b; }
            .project p { color: #475569; margin-bottom: 1rem; line-height: 1.6; font-size: 1rem; }
            .tech-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
            .tech-tag { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); color: #92400e; padding: 0.25rem 0.75rem; border-radius: 16px; font-size: 0.875rem; font-weight: 500; border: 1px solid #fbbf24; }
            .github-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #ffffff; background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 0.75rem 1.25rem; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.95rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .contact { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 2rem; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center; }
            .social-links { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
            .social-link { background: #22223b; color: #fff; padding: 1rem 1.5rem; border-radius: 12px; text-decoration: none; font-size: 1rem; font-weight: 600; margin: 0 0.5rem; display: inline-flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .footer { background: #22223b; color: #f9fafb; text-align: center; padding: 1.5rem; font-size: 0.9rem; }
            @media print { body { background: white; padding: 0; } .hero { background: #22223b !important; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="hero">
              <div class="hero-content">
                ${portfolio.profilePicture ? `<img src="${portfolio.profilePicture}" class="avatar" alt="Profile Picture" />` : ''}
                <h1>${portfolio.name || user?.name}</h1>
                ${portfolio.professionalTitle ? `<div class="title">${portfolio.professionalTitle}</div>` : ''}
                <div class="meta">
                  ${portfolio.location ? `<span>📍 ${portfolio.location}</span>` : ''}
                  ${portfolio.yearsOfExperience ? `<span>💼 ${portfolio.yearsOfExperience} years experience</span>` : ''}
                </div>
              </div>
            </div>
            <div class="content">
              ${portfolio.bio ? `
                <section class="section">
                  <h2>About Me</h2>
                  <div class="about-text">${portfolio.bio}</div>
                </section>
              ` : ''}
              ${portfolio.skills.length > 0 ? `
                <section class="section">
                  <h2 style="border-bottom-color: #10b981;">Skills & Expertise</h2>
                  <div class="skills-grid">
                    ${portfolio.skills.map(skill => `
                      <div class="skill-item">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-level">${skill.level}</span>
                      </div>
                    `).join('')}
                  </div>
                </section>
              ` : ''}
              <section class="section projects">
                <h2>Featured Projects</h2>
                ${portfolio.projects.length > 0 ? portfolio.projects.map(project => `
                  <div class="project">
                    <h3>${project.title}</h3>
                    ${project.description ? `<p>${project.description}</p>` : ''}
                    ${project.technologies?.length > 0 ? `
                      <div class="tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                      </div>
                    ` : ''}
                    ${project.githubUrl ? `<a href="${project.githubUrl}" class="github-link" target="_blank">📱 View Project</a>` : ''}
                  </div>
                `).join('') : '<div style="text-align: center; padding: 3rem; color: #64748b; background: #f8fafc; border-radius: 12px; border: 2px dashed #cbd5e1;"><div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div><p>No projects added yet.</p></div>'}
              </section>
              ${(portfolio.socialLinks?.linkedin || portfolio.socialLinks?.github) ? `
                <section class="contact">
                  <h2 style="border-bottom-color: #8b5cf6;">Let's Connect</h2>
                  <div class="social-links">
                    ${portfolio.socialLinks?.linkedin ? `<a href="${portfolio.socialLinks.linkedin}" class="social-link" target="_blank">💼 LinkedIn</a>` : ''}
                    ${portfolio.socialLinks?.github ? `<a href="${portfolio.socialLinks.github}" class="social-link" target="_blank">💻 GitHub</a>` : ''}
                  </div>
                </section>
              ` : ''}
            </div>
            <div class="footer">
              <div style="margin-bottom: 0.5rem;">Built with ❤️ using CareerCanvas</div>
              <div style="font-size: 0.8rem; opacity: 0.7;">Professional Portfolio Generator</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([portfolioContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user?.name || 'Portfolio'}_Professional_Resume.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('🎉 Beautiful portfolio downloaded! Open the HTML file in your browser and use "Print > Save as PDF" for the perfect resume.');
  };

  if (loading) {
    return <div className="container" style={{padding: '2rem 0'}}>Loading...</div>;
  }

  const progress = calculateProgress();

  return (
    <div style={{background: "#f8fafc", minHeight: "100vh", padding: "1rem 0"}}>
      <div className="container">
        <div style={{margin: "2rem 0 2.5rem 0"}}>
          <h1 style={{fontWeight: 800, fontSize: "2.1rem", marginBottom: 0, color: "#1e293b"}}>
            Welcome back, {user?.name}!
            <span role="img" aria-label="wave"> 👋</span>
          </h1>
          <p style={{color: "#64748b", marginTop: "0.7rem", fontSize: "1.1rem"}}>
            Let's continue building your professional brand and showcase your amazing work.
          </p>
        </div>
        <div style={{display: "flex", gap: "1.5rem", marginBottom: "2.2rem", flexWrap: "wrap"}}>
          <StatCard label="Profile Completeness" value={`${progress}%`} icon="🎯" iconBg="#6366f1" progress={progress}/>
          <StatCard label="Projects" value={portfolio?.projects?.length || 0} icon="💼" iconBg="#10b981"/>
          <StatCard label="Skills" value={portfolio?.skills?.length || 0} icon="⚡" iconBg="#7c3aed"/>
        </div>
        <div style={{display: "flex", gap: "2rem", flexWrap: "wrap"}}>
          <div style={{flex: 2, minWidth: 350}}>
            <div style={{background: "#fff", borderRadius: "14px", boxShadow: "0 2px 18px 0 rgba(0,0,0,0.03)", marginBottom: "2rem"}}>
              <div style={{padding: "1.2rem 1.5rem 1rem 1.5rem"}}>
                <span style={{fontWeight: 700, fontSize: "1.04rem", display: "flex", alignItems: "center", gap: "6px"}}>
                  <span role="img" aria-label="trophy">🏆</span> Quick Actions
                </span>
                <div style={{fontSize: "0.97rem", color: "#64748b", marginTop: "0.3rem"}}>Build and manage your professional presence</div>
              </div>
              {isEmptyPortfolio() ? (
                <div style={{border: "2px dashed #d1d5db", borderRadius: "12px", padding: "2.4rem 1rem", margin: "1.2rem", background: "#f6f8fe"}}>
                  <div style={{textAlign: "center"}}>
                    <div style={{fontSize: "2.7rem", color: "#6366f1", marginBottom: "0.35rem"}}>👤</div>
                    <div style={{fontWeight: 700, fontSize: "1.23rem", marginBottom: "0.33rem"}}>Create Your First Portfolio</div>
                    <div style={{color: "#64748b", marginBottom: "1.3rem"}}>Get started by building your professional portfolio with CareerCanvas AI-powered builder.</div>
                    <button style={{background: "#111827", color: "#fff", border: "none", borderRadius: "8px", padding: "0.7rem 1.5rem", fontWeight: 700, fontSize: "1.05rem", cursor: "pointer"}} onClick={() => navigate('/builder')}>+ Create Portfolio</button>
                  </div>
                </div>
              ) : (
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0"}}>
                  <button style={{background: "#3b82f6", color: "white", border: "none", padding: "1.5rem", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.5rem", fontSize: "1rem", fontWeight: "600"}} onClick={() => navigate('/builder')}><span>✏️</span><div><div>Edit Portfolio</div><div style={{fontSize: "0.8rem", opacity: 0.8}}>Update your information</div></div></button>
                  <button style={{background: "#10b981", color: "white", border: "none", padding: "1.5rem", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.5rem", fontSize: "1rem", fontWeight: "600"}} onClick={handleViewPublicPortfolio}><span>🌐</span><div><div>View Public Portfolio</div><div style={{fontSize: "0.8rem", opacity: 0.8}}>See how others see you</div></div></button>
                  <button style={{background: "#6366f1", color: "white", border: "none", padding: "1.5rem", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.5rem", fontSize: "1rem", fontWeight: "600"}} onClick={handleSharePortfolio}><span>🔗</span><div><div>Share Portfolio</div><div style={{fontSize: "0.8rem", opacity: 0.8}}>Copy public link</div></div></button>
                  <button style={{background: "#f59e0b", color: "white", border: "none", padding: "1.5rem", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.5rem", fontSize: "1rem", fontWeight: "600"}} onClick={handleDownloadPortfolio}><span>📄</span><div><div>Download Portfolio</div><div style={{fontSize: "0.8rem", opacity: 0.8}}>Export as PDF</div></div></button>
                </div>
              )}
            </div>
            {/* You can continue your "Recent Projects" or other left-side widgets here */}
          </div>
          <div style={{flex: 1, minWidth: 290, display: "flex", flexDirection:"column", gap:"1.5rem"}}>
            <div style={{background: "#fff", borderRadius: "14px", boxShadow: "0 2px 18px 0 rgba(0,0,0,0.03)", padding: "1.5rem"}}>
              <div style={{fontWeight: 700, marginBottom: "1rem"}}>Profile Completion</div>
              <div style={{fontSize: "0.96rem", color: "#64748b", marginBottom: "1rem"}}>Complete your profile to improve visibility</div>
              <div style={{margin: "0.9rem 0", fontWeight: 700, fontSize: "1.1rem"}}>Overall Progress: {progress}%
                <div style={{height: "10px", background: "#e5e7eb", borderRadius: "5px", overflow: "hidden", marginTop: "0.45rem"}}>
                  <div style={{width: `${progress}%`, height: "100%", background: "#6366f1", transition: "width 0.3s"}} />
                </div>
              </div>
              <div style={{fontSize: "0.97rem", color: "#475569", marginTop: "1rem", marginBottom: "0.3rem"}}>
                <div style={{display: "flex", justifyContent: "space-between"}}><span>Basic Info</span><span>{portfolio?.professionalTitle ? '✅' : '--'}</span></div>
                <div style={{display: "flex", justifyContent: "space-between"}}><span>Skills Added</span><span>{portfolio?.skills?.length > 0 ? '✅' : '--'}</span></div>
                <div style={{display: "flex", justifyContent: "space-between"}}><span>Projects</span><span>{portfolio?.projects?.length > 0 ? '✅' : '--'}</span></div>
              </div>
            </div>
            <div style={{background: "#fff", borderRadius: "14px", boxShadow: "0 2px 18px 0 rgba(0,0,0,0.03)", padding: "1.1rem"}}>
              <div style={{fontWeight: 700, marginBottom: "0.7rem"}}>💡 Pro Tips</div>
              <ul style={{fontSize: "0.97rem", color: "#475569", margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.42rem"}}>
                <li>Add at least 3 projects to showcase your skills</li>
                <li>Include social media links for better networking</li>
                <li>Regular updates improve your portfolio ranking</li>
                <li>Use keywords relevant to your industry</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon, iconBg, progress }) => (
  <div style={{
    background: "#fff",
    padding: "1.1rem 1.3rem",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    minWidth: 200,
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }}>
    <div>
      <div style={{ fontSize: "0.99rem", color: "#64748b", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: "1.55rem", fontWeight: 800, color: "#1e293b" }}>{value}</div>
      {progress !== undefined && (
        <div style={{
          width: "100%",
          height: "8px",
          background: "#e2e8f0",
          borderRadius: "4px",
          overflow: "hidden",
          marginTop: "0.5rem"
        }}>
          <div style={{
            height: "100%",
            background: iconBg,
            width: `${progress}%`,
            transition: "width 0.3s ease"
          }} />
        </div>
      )}
    </div>
    <div style={{
      minWidth: 48, minHeight: 48, fontSize: "1.4rem",
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: "50%", background: iconBg, color: "#fff"
    }}>
      {icon}
    </div>
  </div>
);

export default Dashboard;
