import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Calendar, Eye, Trash, RefreshCw, AlertCircle, UploadCloud } from 'lucide-react';
import { api, getCurrentUser } from '../utils/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getCurrentUser()) {
      navigate('/login');
      return;
    }
    loadHistory();
  }, [navigate]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getHistory();
      setHistory(data);
    } catch (err) {
      setError('Could not retrieve evaluation history records.');
    } finally {
      setLoading(false);
    }
  };

  const scoreBadgeStyle = (score) => {
    let color = 'var(--color-danger)';
    let bg = 'rgba(239, 68, 68, 0.15)';
    if (score >= 80) {
      color = 'var(--color-success)';
      bg = 'rgba(16, 185, 129, 0.15)';
    } else if (score >= 65) {
      color = 'var(--color-warning)';
      bg = 'rgba(245, 158, 11, 0.15)';
    }else if (score >= 50) {
      color = 'var(--color-info)';
      bg = 'rgba(59, 130, 246, 0.15)';
    }

    return {
      color,
      backgroundColor: bg,
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 700
    };
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />

        <div style={{ display: 'flex', gap: '24px', flex: 1, paddingBottom: '40px' }}>
          <Sidebar />

          <main className="glass-pane" style={{ flex: 1, padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Evaluation Records</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Review historical resume analysis runs and profile metrics.
                </p>
              </div>
              <button onClick={loadHistory} className="secondary-btn" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <RefreshCw size={28} color="var(--color-secondary)" className="animate-spin" />
              </div>
            ) : error ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '16px',
                borderRadius: '10px',
                color: 'var(--color-danger)'
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            ) : history.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}>
                <FileText size={40} color="var(--text-muted)" />
                <h4>No audits completed yet</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  Start by uploading and evaluating a resume.
                </p>
                <Link to="/upload" className="gradient-btn" style={{
                  padding: '10px 24px',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <UploadCloud size={16} />
                  <span>Upload Resume</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history.map((record) => (
                  <div 
                    key={record.id} 
                    className="glass-pane"
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px',
                      background: 'rgba(255,255,255,0.015)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        background: 'rgba(124, 58, 237, 0.1)',
                        padding: '10px',
                        borderRadius: '8px',
                        color: 'var(--color-primary)'
                      }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                          {record.fileName}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>{record.candidateName}</span>
                          <span>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} />
                            {new Date(record.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div>
                        <span style={scoreBadgeStyle(record.score)}>
                          Score: {record.score}
                        </span>
                      </div>

                      <button 
                        onClick={() => navigate(`/history/${record.id}`)}
                        className="secondary-btn"
                        style={{
                          padding: '8px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.85rem'
                        }}
                      >
                        <Eye size={14} />
                        View Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
