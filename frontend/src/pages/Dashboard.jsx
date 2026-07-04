import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, FileText, CheckCircle2, AlertOctagon, 
  Map, MessageSquare, Compass, AlertCircle, RefreshCw, Layers 
} from 'lucide-react';
import { api, getCurrentUser } from '../utils/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ScoreMetric from '../components/ScoreMetric';

export default function Dashboard() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Track open question indexes
  const [activeQuestion, setActiveQuestion] = useState(null);

  useEffect(() => {
    if (!getCurrentUser()) {
      navigate('/login');
      return;
    }
    loadLatestAnalysis();
  }, [navigate]);

  const loadLatestAnalysis = async () => {
    try {
      setLoading(true);
      setError('');
      
      let targetId = localStorage.getItem('latest_analysis_id');
      
      if (!targetId) {
        // Find latest from history
        const history = await api.getHistory();
        if (history && history.length > 0) {
          targetId = history[0].id;
        }
      }

      if (targetId) {
        const details = await api.getAnalysisDetails(targetId);
        setAnalysis(details);
      }
    } catch (err) {
      setError('Could not fetch resume analysis indicators.');
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (idx) => {
    setActiveQuestion(activeQuestion === idx ? null : idx);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />

        <div style={{ display: 'flex', gap: '24px', flex: 1, paddingBottom: '40px' }}>
          <Sidebar />

          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {loading ? (
              <div className="glass-pane" style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '100px 0'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <RefreshCw size={36} color="var(--color-secondary)" className="animate-spin" style={{ marginBottom: '16px' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>Loading latest evaluation details...</p>
                </div>
              </div>
            ) : error ? (
              <div className="glass-pane" style={{ padding: '40px', textAlign: 'center' }}>
                <AlertCircle size={36} color="var(--color-danger)" style={{ marginBottom: '16px' }} />
                <h3>Error Loading Dashboard</h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{error}</p>
                <button className="gradient-btn" onClick={loadLatestAnalysis} style={{ marginTop: '20px', padding: '10px 20px' }}>
                  <span>Retry Fetch</span>
                </button>
              </div>
            ) : !analysis ? (
              <div className="glass-pane" style={{
                padding: '80px 40px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{
                  background: 'rgba(0, 242, 254, 0.05)',
                  padding: '24px',
                  borderRadius: '50%',
                  color: 'var(--color-secondary)'
                }}>
                  <FileText size={48} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>No resumes evaluated yet</h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto', fontSize: '0.95rem' }}>
                    Upload your first resume in PDF format. CareerPilot AI will parse, score, and map a personalized training route instantly.
                  </p>
                </div>
                <Link to="/upload" className="gradient-btn" style={{
                  padding: '14px 32px',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  borderRadius: '10px'
                }}>
                  <span>Upload PDF Resume</span>
                </Link>
              </div>
            ) : (
              // Full Performance Dashboard UI
              <div className="dashboard-grid">
                
                {/* Visual score dial block */}
                <div className="glass-pane card-span-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', padding: '16px 20px 0 20px', width: '100%', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ATS Score
                  </h3>
                  <ScoreMetric score={analysis.resumeScore} />
                </div>

                {/* Candidate Info profile card */}
                <div className="glass-pane card-span-8" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="badge badge-info" style={{ marginBottom: '8px' }}>Active Profile</span>
                      <h2 style={{ fontSize: '1.8rem' }}>{analysis.candidateInfo?.name || 'Candidate profile'}</h2>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Evaluated: {new Date(analysis.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Email</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{analysis.candidateInfo?.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Phone</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{analysis.candidateInfo?.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Target Roles</span>
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-secondary)', fontWeight: 600 }}>{analysis.recommendedRoles?.[0] || 'Software Professional'}</span>
                    </div>
                  </div>

                  {analysis.candidateInfo?.education?.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>Education</span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{analysis.candidateInfo.education.join(' | ')}</p>
                    </div>
                  )}
                </div>

                {/* Technical Skills Overview */}
                <div className="glass-pane card-span-12" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers size={18} color="var(--color-secondary)" />
                    Extracted Skills Inventory
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {analysis.candidateInfo?.skills?.map((skill, index) => (
                      <span key={index} style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-light)',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        color: 'var(--text-primary)',
                        transition: 'var(--transition-smooth)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Strengths & Weaknesses comparison grid */}
                <div className="glass-pane card-span-6" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} />
                    Strengths Identified
                  </h3>
                  <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {analysis.strengths?.map((item, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-pane card-span-6" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertOctagon size={18} />
                    Critiques & Weaknesses
                  </h3>
                  <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {analysis.weaknesses?.map((item, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        <span style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>⚠</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Skills and ATS Recommendations */}
                <div className="glass-pane card-span-6" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} />
                    Critical Skills Gap
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {analysis.missingSkills?.map((skill, index) => (
                      <span key={index} className="badge badge-warning" style={{ borderRadius: '20px', padding: '6px 12px', fontSize: '0.8rem' }}>
                        + {skill}
                      </span>
                    ))}
                  </div>
                  <p style={{ marginTop: '16px', fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Tip: Target these skills first in your upcoming project roadmaps to pass resume filters.
                  </p>
                </div>

                <div className="glass-pane card-span-6" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="var(--color-secondary)" />
                    ATS Optimization Rules
                  </h3>
                  <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {analysis.atsSuggestions?.map((item, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        <span style={{ color: 'var(--color-secondary)' }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Career Advice Banner card */}
                {analysis.careerAdvice && (
                  <div className="glass-pane card-span-12" style={{
                    padding: '24px',
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(0, 242, 254, 0.03) 100%)',
                    border: '1px solid rgba(124, 58, 237, 0.2)'
                  }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Advisor's Insights</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                      "{analysis.careerAdvice}"
                    </p>
                  </div>
                )}

                {/* Recommended Job roles board */}
                <div className="glass-pane card-span-12" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Suggested Job Positions</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {analysis.recommendedRoles?.map((role, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(0, 242, 254, 0.05)',
                        border: '1px solid rgba(0, 242, 254, 0.15)',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--color-secondary)'
                      }}>
                        {role}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly learning roadmap */}
                <div className="glass-pane card-span-12" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Map size={18} color="var(--color-secondary)" />
                    Personal Learning Blueprint
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {analysis.learningRoadmap?.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          minWidth: '120px',
                          textAlign: 'center'
                        }}>
                          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#ffffff', opacity: 0.8 }}>Timeline</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>{item.duration || 'Flexible'}</span>
                        </div>
                        <div style={{ padding: '20px', flex: 1 }}>
                          <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{item.topic}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Focus Areas: </span> {item.resources}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interview Prep Questions */}
                <div className="glass-pane card-span-12" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageSquare size={18} color="var(--color-secondary)" />
                    Predictive Interview Simulator
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {analysis.interviewQuestions?.map((item, idx) => {
                      const isOpen = activeQuestion === idx;
                      return (
                        <div key={idx} style={{
                          border: '1px solid var(--border-light)',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          transition: 'var(--transition-smooth)'
                        }}>
                          <button
                            onClick={() => toggleQuestion(idx)}
                            style={{
                              width: '100%',
                              padding: '16px 20px',
                              background: isOpen ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                              border: 'none',
                              color: 'var(--text-primary)',
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontFamily: 'inherit'
                            }}
                          >
                            <span>Q{idx + 1}: {item.question}</span>
                            <span style={{
                              color: 'var(--color-secondary)',
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                              transition: 'transform 0.2s ease'
                            }}>
                              ▼
                            </span>
                          </button>
                          {isOpen && (
                            <div style={{
                              padding: '20px',
                              background: '#0B0F19',
                              borderTop: '1px solid var(--border-light)',
                              fontSize: '0.9rem',
                              lineHeight: '1.6',
                              color: 'var(--text-secondary)'
                            }}>
                              <p style={{ marginBottom: '8px', color: 'var(--color-secondary)', fontWeight: 600 }}>Suggested Response Strategy:</p>
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
