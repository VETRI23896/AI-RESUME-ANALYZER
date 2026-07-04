import React from 'react';

export default function ScoreMetric({ score }) {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine score quality description and color
  let statusColor = 'var(--color-danger)';
  let statusText = 'Needs Attention';
  if (score >= 80) {
    statusColor = 'var(--color-success)';
    statusText = 'Excellent Profile';
  } else if (score >= 65) {
    statusColor = 'var(--color-warning)';
    statusText = 'Good Foundation';
  } else if (score >= 50) {
    statusColor = 'var(--color-info)';
    statusText = 'Average Profile';
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ position: 'relative', width: radius * 3, height: radius * 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Dynamic circular SVG */}
        <svg height={radius * 2.5} width={radius * 2.5} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-gradient-start)" />
              <stop offset="100%" stopColor="var(--color-gradient-end)" />
            </linearGradient>
          </defs>
          {/* Background circle track */}
          <circle
            stroke="rgba(255, 255, 255, 0.05)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius * 1.25}
            cy={radius * 1.25}
          />
          {/* Animated score indicator */}
          <circle
            stroke="url(#scoreGradient)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius * 1.25}
            cy={radius * 1.25}
          />
        </svg>

        {/* Text inside the circle */}
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            lineHeight: '1',
            background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {score}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            out of 100
          </span>
        </div>
      </div>

      <div style={{ marginTop: '12px' }}>
        <span className="badge" style={{
          background: `rgba(${statusColor === 'var(--color-success)' ? '16, 185, 129' : statusColor === 'var(--color-warning)' ? '245, 158, 11' : statusColor === 'var(--color-info)' ? '59, 130, 246' : '239, 68, 68'}, 0.15)`,
          color: statusColor,
          padding: '6px 14px',
          fontSize: '0.8rem',
          borderRadius: '20px',
          fontWeight: 700
        }}>
          {statusText}
        </span>
      </div>
    </div>
  );
}
