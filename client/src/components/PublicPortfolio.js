import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PublicPortfolio() {
  const { userId } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, [userId]);

  const fetchPortfolio = async () => {
    try {
      console.log('Fetching portfolio for userId:', userId); // Debug log
      const response = await axios.get(`/api/portfolio/${userId}`);
      console.log('API Response:', response.data); // Debug log
      setPortfolio(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      console.error('Error response:', error.response?.data); // Debug log
      setLoading(false);
      setPortfolio(null);
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
      <div style={{color: "white", fontSize: "1.2rem"}}>Loading portfolio...</div>
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
      <div style={{color: "white", fontSize: "1.2rem"}}>Portfolio not found.</div>
    </div>
  );

  return (
    <div style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "2rem 0"
    }}>
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        background: "#fff",
        borderRadius: "20px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        overflow: "hidden"
      }}>
        {/* Hero Section - UPDATED TO FOOTER COLOR */}
        <div style={{
          background: "#22223b",
          color: "white",
          padding: "3rem 2rem",
          textAlign: "center",
          position: "relative"
        }}>
          <div style={{position: "relative", zIndex: 1}}>
            {portfolio.profilePicture && (
              <img 
                src={portfolio.profilePicture} 
                alt={portfolio.name}
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "1.5rem",
                  border: "4px solid rgba(255,255,255,0.3)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                }}
              />
            )}
            <h1 style={{
              fontWeight: 800,
              fontSize: "2.5rem",
              marginBottom: "0.2rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              {portfolio.name}
            </h1>
            {portfolio.professionalTitle && (
              <div style={{
                fontSize: "1.1rem",
                marginBottom: "1rem",
                opacity: 0.95,
                fontWeight: "500"
              }}>
                {portfolio.professionalTitle}
              </div>
            )}
            <div style={{
              fontSize: "1rem",
              opacity: 0.9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap"
            }}>
              {portfolio.location && (
                <span style={{display: "flex", alignItems: "center", gap: "0.25rem"}}> 
                  <span style={{color: "#ef4444", fontSize: "0.95rem"}}>●</span> {portfolio.location}
                </span>
              )}
              {portfolio.yearsOfExperience > 0 && (
                <span style={{display: "flex", alignItems: "center", gap: "0.25rem"}}>
                  <span style={{color: "#92400e"}}>💼</span> {portfolio.yearsOfExperience} years experience
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{padding: "2.5rem"}}>
          {/* About Section */}
          {portfolio.bio && (
            <section style={{marginBottom: "3rem"}}>
              <h2 style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "1rem",
                borderBottom: "2px solid #6366f1",
                paddingBottom: "0.30rem",
                display: "inline-block"
              }}>
                About Me
              </h2>
              <div style={{
                color: "#475569",
                fontSize: "1.07rem",
                lineHeight: "1.7",
                backgroundColor: "#f9fafb",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0"
              }}>
                {portfolio.bio}
              </div>
            </section>
          )}
          
          {/* Skills Section */}
          {portfolio.skills && portfolio.skills.length > 0 && (
            <section style={{marginBottom: "3rem"}}>
              <h2 style={{
                fontSize: "1.3rem", fontWeight: 700, color: "#1e293b", marginBottom: "0.9rem",
                borderBottom: "2px solid #06b6d4", paddingBottom: "0.30rem", display: "inline-block"
              }}>
                Skills & Expertise
              </h2>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem"
              }}>
                {portfolio.skills.map((skill, idx) => (
                  <div key={idx} style={{
                    background: "linear-gradient(90deg, #e0f2fe 20%, #bae6fd 100%)",
                    border: "1px solid #38bdf8",
                    borderRadius: "7px",
                    padding: "0.7rem 1.2rem",
                    fontWeight: "600",
                    color: "#0369a1",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.3rem"
                  }}>
                    <span>{skill.name}</span>
                    <span style={{
                      background: "#7dd3fc", color: "#0369a1", padding: "0.15rem 0.75rem",
                      borderRadius: "18px", fontWeight: 500, fontSize: "0.9rem"
                    }}>
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Projects Section */}
          <section style={{marginBottom: "3rem"}}>
            <h2 style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#1e293b",
              marginBottom: "0.9rem",
              borderBottom: "2px solid #fbbf24",
              paddingBottom: "0.30rem",
              display: "inline-block"
            }}>
              Featured Projects
            </h2>
            {portfolio.projects && portfolio.projects.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "2rem",
                color: "#64748b",
                background: "#f1f5f9",
                borderRadius: "12px",
                border: "2px dashed #cbd5e1"
              }}>
                <div style={{fontSize: "2.2rem", marginBottom: "1rem"}}>🚀</div>
                <p>No projects added yet.</p>
              </div>
            )}
            <div style={{
              display: "grid",
              gap: "1.7rem"
            }}>
              {portfolio.projects && portfolio.projects.map((project, idx) => (
                <div key={idx} style={{
                  background: "#fff",
                  border: "1.5px solid #fde68a",
                  borderRadius: "12px",
                  padding: "1.35rem 1.65rem",
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.07)",
                  position: "relative"
                }}>
                  <h3 style={{
                    fontSize: "1.13rem",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                    color: "#22223b"
                  }}>
                    {project.title}
                  </h3>
                  {project.description && (
                    <div style={{
                      color: "#64748b",
                      marginBottom: "0.7rem",
                      lineHeight: "1.5",
                      fontSize: "1.02rem"
                    }}>
                      {project.description}
                    </div>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div style={{marginBottom: "0.8rem"}}>
                      <span style={{
                        background: "#f3f4f6",
                        borderRadius: "7px",
                        fontSize: "0.93rem",
                        color: "#92400e", padding: "0.25rem 0.9rem",
                        border: "1px solid #f59e0b"
                      }}>
                        {project.technologies.join(', ')}
                      </span>
                    </div>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        background: "#22223b",
                        color: "#fff",
                        border: "none",
                        padding: "0.55rem 1.2rem",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontWeight: "600",
                        fontSize: "0.98rem",
                        letterSpacing: "0.01em",
                        marginTop: "0.18rem"
                      }}
                    >
                      GitHub
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
          
          {/* Contact Section - UPDATED LINKEDIN TO MATCH GITHUB */}
          {(portfolio.socialLinks?.linkedin || portfolio.socialLinks?.github) && (
            <section style={{
              background: "#f1f5f9",
              padding: "2rem",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              textAlign: "center"
            }}>
              <h2 style={{
                fontSize: "1.21rem",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "1.5rem"
              }}>
                Let's Connect
              </h2>
              <div style={{
                display: "flex",
                gap: "1.4rem",
                justifyContent: "center",
                flexWrap: "wrap"
              }}>
                {portfolio.socialLinks?.linkedin && (
                  <a 
                    href={portfolio.socialLinks.linkedin} 
                    style={{
                      background: "#22223b",
                      color: "#fff",
                      padding: "0.75rem 1.3rem",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "1rem",
                      marginBottom: "0.2rem",
                      display: "inline-block",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                    }} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span style={{marginRight:"0.4em"}}>🟦</span> LinkedIn
                  </a>
                )}
                {portfolio.socialLinks?.github && (
                  <a 
                    href={portfolio.socialLinks.github} 
                    style={{
                      background: "#22223b",
                      color: "#fff",
                      padding: "0.75rem 1.3rem",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "1rem",
                      marginBottom: "0.2rem",
                      display: "inline-block",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                    }} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span style={{marginRight:"0.4em"}}>🐙</span> GitHub
                  </a>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div style={{
          background: "#22223b",
          color: "#f9fafb",
          textAlign: "center",
          padding: "1.2rem 0 0.5rem 0",
          borderTopLeftRadius: "18px",
          borderTopRightRadius: "18px",
          fontSize: "1rem"
        }}>
          <div>
            Built with <span style={{color:"#f87171"}}>♥</span> using CareerCanvas
          </div>
          <div style={{fontSize: "0.88rem", opacity: 0.8, marginTop: "6px"}}>
            Create your own professional portfolio today
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicPortfolio;
