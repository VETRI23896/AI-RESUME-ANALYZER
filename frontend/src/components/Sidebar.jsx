import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, History, HelpCircle } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Resume', path: '/upload', icon: UploadCloud },
    { name: 'Analysis Records', path: '/history', icon: History },
  ];

  return (
    <aside className="glass-pane" style={{
      width: '260px',
      padding: '24px 16px',
      height: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      position: 'sticky',
      top: '24px'
    }}>
      <div style={{
        padding: '0 12px 16px 12px',
        borderBottom: '1px solid var(--border-light)',
        marginBottom: '16px'
      }}>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
          Navigation
        </h4>
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: 'none',
              background: isActive 
                ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(0, 242, 254, 0.05) 100%)' 
                : 'transparent',
              color: isActive ? 'var(--color-secondary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontWeight: isActive ? 600 : 500,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: isActive ? 'inset 0 0 10px rgba(0, 242, 254, 0.05)' : 'none',
              borderLeft: isActive ? '3px solid var(--color-secondary)' : '3px solid transparent',
              transition: 'var(--transition-smooth)',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if(!isActive) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if(!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            <Icon size={18} />
            {item.name}
          </button>
        );
      })}

      <div style={{
        marginTop: '40px',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '10px',
        border: '1px solid var(--border-light)',
        textAlign: 'center'
      }}>
        <HelpCircle size={20} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
        <h5 style={{ fontSize: '0.85rem', marginBottom: '4px', fontWeight: 600 }}>Need Assistance?</h5>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          Upload your resume in PDF format. CareerPilot AI parses your experience parameters instantly.
        </p>
      </div>
    </aside>
  );
}
