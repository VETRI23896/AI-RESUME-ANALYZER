import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, AlertTriangle, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { api, getCurrentUser } from '../utils/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');

  useEffect(() => {
    if (!getCurrentUser()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (selectedFile) => {
    setError('');
    
    // Check file type
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Invalid file type. Only PDF documents are allowed.');
      setFile(null);
      return;
    }

    // Check size limit: 10MB
    const maxBytes = 10 * 1024 * 1024;
    if (selectedFile.size > maxBytes) {
      setError('File size too large. Max limit is 10MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setError('');
      setLoading(true);
      
      // Step status updates to keep user aligned
      setLoadingStatus('1. Uploading PDF Resume...');
      setTimeout(() => setLoadingStatus('2. Parsing text with Apache PDFBox...'), 1200);
      setTimeout(() => setLoadingStatus('3. Evaluating profile with Gemini AI...'), 2400);

      const result = await api.uploadResume(file);
      
      // Store the latest analysis ID in local storage to access on Dashboard easily
      localStorage.setItem('latest_analysis_id', result.id);
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Analysis failed. Please ensure the PDF is not blank/scanned image.');
      setLoading(false);
      setLoadingStatus('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />

        <div style={{ display: 'flex', gap: '24px', flex: 1, paddingBottom: '40px' }}>
          <Sidebar />

          <main className="glass-pane" style={{ flex: 1, padding: '32px' }}>
            {loading ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 0',
                gap: '24px',
                textAlign: 'center'
              }}>
                <div style={{
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(0, 242, 254, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.05)'
                }} className="pulse-glow-box">
                  <Compass size={36} color="var(--color-secondary)" className="animate-spin" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Processing Resume</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {loadingStatus}
                  </p>
                </div>
                <div style={{
                  maxWidth: '320px',
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  height: '4px',
                  borderRadius: '2px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    height: '100%',
                    width: '60%',
                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                    animation: 'pulse-glow 1.5s infinite alternate'
                  }}></div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Upload Resume</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Submit your resume in PDF format to start a comprehensive CareerPilot evaluation scan.
                  </p>
                </div>

                {error && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    padding: '16px',
                    borderRadius: '10px',
                    color: 'var(--color-danger)',
                    fontSize: '0.9rem',
                    marginBottom: '24px'
                  }}>
                    <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                  </div>
                )}

                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  style={{
                    border: dragActive ? '2px dashed var(--color-secondary)' : '2px dashed var(--border-light)',
                    background: dragActive ? 'rgba(0, 242, 254, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                    borderRadius: '16px',
                    padding: '60px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  onClick={() => document.getElementById('file-upload-input').click()}
                >
                  <input
                    type="file"
                    id="file-upload-input"
                    style={{ display: 'none' }}
                    accept=".pdf"
                    onChange={handleFileChange}
                  />

                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-light)',
                    padding: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-secondary)'
                  }}>
                    <UploadCloud size={32} />
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Drag and drop your PDF here</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      or click to browse local files (maximum file size 10MB)
                    </p>
                  </div>
                </div>

                {file && (
                  <div className="glass-pane" style={{
                    marginTop: '24px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(0, 242, 254, 0.15)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        background: 'rgba(124, 58, 237, 0.1)',
                        padding: '10px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-primary)'
                      }}>
                        <File size={22} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{file.name}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    </div>

                    <button className="gradient-btn" onClick={handleAnalyze} style={{
                      padding: '12px 28px',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>Begin AI Evaluation</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
