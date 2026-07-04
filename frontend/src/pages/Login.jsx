import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { api, setSession, getCurrentUser } from '../utils/api';
import Header from '../components/Header';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already authenticated, route direct to dashboard
    if (getCurrentUser()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all standard credentials.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const res = await api.login(email, password);
      setSession(res.token, res.username, res.email, res.userId);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Credentials entered are invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, paddingBottom: '60px' }}>
          <div className="glass-pane" style={{ width: '100%', maxWidth: '440px', padding: '40px 32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome Back</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Access your CareerPilot dashboard
              </p>
            </div>

            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '12px',
                borderRadius: '8px',
                color: 'var(--color-danger)',
                fontSize: '0.85rem',
                marginBottom: '20px'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '15px' }} />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '48px' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '28px' }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '15px' }} />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '48px' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="gradient-btn"
                style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                disabled={loading}
              >
                <span>{loading ? 'Validating credentials...' : 'Sign In'}</span>
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 600 }}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
