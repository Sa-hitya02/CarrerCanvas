import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PublicPortfolio() {
  const { userId } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/portfolio/${userId}`);
        setPortfolio(response.data);
      } catch {
        setPortfolio(null);
      }
      setLoading(false);
    };
    fetchPortfolio();
  }, [API_URL, userId]);

  if (loading)
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg,#8bb9f7 0%,#7666ce 100%)"
      }}>
        <div style={{ color: "#fff", fontSize: "1.4rem" }}>Loading portfolio...</div>
      </div>
    );
  if (!portfolio)
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg,#8bb9f7 0%,#7666ce 100%)"
      }}>
        <div style={{ color: "#fff", fontSize: "1.4rem" }}>
          Portfolio not found.
        </div>
      </div>
    );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #8bb9f7 0%, #7666ce 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: 'Times New Roman, serif'
    }}>
      <div style={{
        maxWidth: 900,
        width: "100%",
        background: "#fff",
        borderRadius: "22px",
        boxShadow: "0 4px 32px 0 rgba(40,32,70,0.14)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        margin: "32px",
      }}>
        {/* Header */}
        <div style={{
          background: "#23233a",
          color: "#fff",
          padding: "2.8rem 0 1.6rem 0",
          textAlign: "center",
          borderTopLeftRadius: "22px",
          borderTopRightRadius: "22px"
        }}>
          <div style={{ fontWeight: 800, fontSize: "2.3rem", marginBottom: "0.2rem", letterSpacing: "0.02em" }}>
            {portfolio.name}
          </div>
          <div style={{ fontWeight: 600, fontSize: "1.15rem" }}>
            {portfolio.professionalTitle}
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.8rem",
            fontWeight: 500,
            fontSize: "1.01rem",
            marginTop: "0.6rem"
          }}>
            {portfolio.location &&
              <span style={{ color: "white", display: "flex", alignItems: "center", gap: "0.17rem" }}>
                <span role="img" aria-label="location">📍</span>{portfolio.location}
              </span>}
            {portfolio.yearsOfExperience > 0 &&
              <span style={{ color: "white", display: "flex", alignItems: "center", gap: "0.18rem" }}>
                <span role="img" aria-label="exp">💼</span>
                {portfolio.yearsOfExperience} years experience
              </span>
            }
          </div>
        </div>

        <div style={{ padding: "2.2rem 2.3rem 0.5rem 2.3rem", flex: "1 0 auto" }}>
          {/* About Me */}
          <div>
            <div style={{
              fontWeight: 700, fontSize: "1.53rem",
              color: "#23233a", marginBottom: "0.33rem",
              borderBottom: "3px solid #6366f1", display: "inline-block", paddingBottom: "0.05rem"
            }}>About Me</div>
            <div style={{
              background: "#f7fafe",
              borderRadius: "14px",
              border: "1px solid #f1f5f9",
              padding: "1.1rem 1.17rem",
              marginTop: "0.7rem",
              color: "#374151",
              fontSize: "1.18rem"
            }}>
              {portfolio.bio}
            </div>
          </div>
          {/* Skills & Expertise */}
          <div style={{ marginTop: "2.1rem" }}>
            <div style={{
              fontWeight: 700,
              fontSize: "1.53rem",
              color: "#23233a",
              marginBottom: "0.33rem",
              borderBottom: "3px solid #10b981",
              display: "inline-block",
              paddingBottom: "0.08rem"
            }}>Skills </div>
            <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.7rem", flexWrap: "wrap" }}>
              {portfolio.skills.length === 0 ? (
                <span style={{ color: "#b0b0b8", fontStyle: "italic" }}>No skills listed.</span>
              ) : (
                portfolio.skills.map(skill => (
                  <div key={skill._id || skill.name} style={{
                    background: "linear-gradient(87deg,#e0f2fe 8%, #ecfdf5 100%)",
                    border: "2px solid #8de4fc",
                    borderRadius: "18px",
                    padding: "0.58rem 1.47rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.3rem",
                    boxShadow: "0 1px 6px 0 rgba(50,50,60,0.03)",
                    fontSize: "1.16rem"
                  }}>
                    <span style={{ fontWeight: 600, color: "#0369a1" }}>{skill.name}</span>
                    <span style={{
                      background: "#0ea5e9",
                      color: "#fff",
                      borderRadius: "10px",
                      fontWeight: 500,
                      fontSize: "1.03rem",
                      padding: "0.28rem 1.22rem",
                      boxShadow: "0 2px 10px 0 #bae6fd"
                    }}>{skill.level}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Featured Projects */}
          <div style={{ marginTop: "2.3rem" }}>
            <div style={{
              fontWeight: 700, fontSize: "1.53rem", color: "#23233a",
              marginBottom: "0.33rem", borderBottom: "3px solid #fac908",
              display: "inline-block", paddingBottom: "0.08rem"
            }}>Projects</div>
            <div style={{
              marginTop: "0.9rem",
              background: "#fff",
              borderRadius: "17px",
              border: "2px solid #f9d57f",
              boxShadow: "0 2px 9px 0 rgba(0,0,0,0.02)",
              padding: "1.35rem 1.18rem"
            }}>
              {(!portfolio.projects || portfolio.projects.length === 0) ? (
                <span style={{ color: "#b0b0b8", fontStyle: "italic" }}>No projects yet.</span>
              ) : (
                portfolio.projects.map(project => (
                  <div key={project._id || project.title} style={{ marginBottom: "0.8rem" }}>
                    <div style={{ fontWeight: 700, fontSize: "1.21rem", color: "#23233a", marginBottom: "0.23rem" }}>
                      {project.title}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "1.14rem", marginBottom: "0.16rem" }}>
                      {project.description}
                    </div>
                    <div style={{ marginBottom: "0.18rem" }}>
                      {(project.technologies || []).map((tech, idx) => (
                        <span key={idx} style={{
                          background: "#fef3c7",
                          color: "#b45309",
                          fontWeight: 600,
                          borderRadius: "10px",
                          padding: "0.2rem 1.09rem",
                          marginRight: "0.35rem",
                          fontSize: "1.08rem"
                        }}>{tech}</span>
                      ))}
                    </div>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl.startsWith('http') ? project.githubUrl : `https://${project.githubUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#6366f1",
                          fontWeight: "600",
                          fontSize: "1.09rem",
                          textDecoration: "none",
                          marginTop: "0.22rem",
                          display: "inline-block"
                        }}
                      >
                        🔗 GitHub
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Social Links */}
          {(portfolio.socialLinks?.linkedin || portfolio.socialLinks?.github) && (
            <div style={{
              textAlign: "center", margin: "2.5rem 0 0 0",
              background: "#f4f4fb", padding: "2rem 1.2rem", borderRadius: "16px", boxShadow: "0 2px 7px 0 rgba(0,0,0,0.04)"
            }}>
              <h3 style={{
                color: "#23233a", fontWeight: 700, fontSize: "1.29rem", marginBottom: "0.9rem"
              }}>Let's Connect</h3>
              <div style={{ display: "flex", gap: "2.3rem", justifyContent: "center" }}>
                {portfolio.socialLinks?.linkedin &&
                  <a
                    href={portfolio.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#23233a", color: "#fff", borderRadius: "8px",
                      padding: "0.82rem 2.27rem", fontWeight: "700", fontSize: "1.07rem",
                      boxShadow: "0 2px 7px 0 rgba(60,60,90,0.08)", textDecoration: "none"
                    }}
                  >💼LinkedIn</a>
                }
                {portfolio.socialLinks?.github &&
                  <a
                    href={portfolio.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#23233a", color: "#fff", borderRadius: "8px",
                      padding: "0.82rem 2.27rem", fontWeight: "700", fontSize: "1.07rem",
                      boxShadow: "0 2px 7px 0 rgba(60,60,90,0.08)", textDecoration: "none"
                    }}
                  >💻GitHub</a>
                }
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <div style={{
          background: "#23233a",
          textAlign: "center",
          padding: "1.16rem 0 0.62rem 0",
          fontSize: "1.11rem",
          color: "#fff",
          borderBottomLeftRadius: "22px",
          borderBottomRightRadius: "22px"
        }}>
          Built with <span style={{ color: "#e879f9" }}>❤️</span> using <span style={{ color: "#fff", fontWeight: 700 }}>CareerCanvas</span>
          <div style={{ fontSize: "0.99rem", opacity: 0.77, color: "#e0eafc" }}>Professional Portfolio Generator</div>
        </div>
      </div>
    </div>
  );
}

export default PublicPortfolio;
