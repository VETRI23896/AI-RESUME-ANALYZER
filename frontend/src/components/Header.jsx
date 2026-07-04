import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, Compass } from 'lucide-react';
import { getCurrentUser, clearSession } from '../utils/api';

export default function Header() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <header className="glass-pane" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      borderRadius: '0px 0px 16px 16px',
      marginBottom: '24px',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      zIndex: 10
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          background: 'linear-gradient(135deg, #7C3AED, #00F2FE)',
          padding: '8px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Compass size={24} color="#ffffff" />
        </div>
        <span style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.5px'
        }} className="gradient-text">
          CareerPilot AI
        </span>
      </Link>

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-light)',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={16} color="var(--color-secondary)" />
            </div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              {user.username}
            </span>
          </div>

          <button onClick={handleLogout} className="secondary-btn" style={{
            padding: '8px 12px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <LogOut size={14} />
            Logout
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login" className="secondary-btn" style={{ padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem' }}>
            Sign In
          </Link>
          <Link to="/register" className="gradient-btn" style={{ padding: '8px 16px', textDecoration: 'none', fontSize: '0.9rem' }}>
            <span>Sign Up</span>
          </Link>
        </div>
      )}
    </header>
  );
}
