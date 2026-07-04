import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, FileText, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';
import Header from '../components/Header';

export default function Landing() {
  const features = [
    {
      icon: Sparkles,
      title: 'Gemini-Powered Evaluation',
      description: 'Run deep semantic analysis using leading LLM layers to review context, projects, and formatting.'
    },
    {
      icon: FileText,
      title: 'ATS Alignment Analyzer',
      description: 'Get specialized critiques on spacing, naming layouts, contact headers, and bullet keyword metrics.'
    },
    {
      icon: BarChart3,
      title: 'Dynamic Score Cards',
      description: 'View custom score indicators mapping matching strengths, weaknesses, and missing skills instantly.'
    },
    {
      icon: ShieldCheck,
      title: 'Growth Roadmap',
      description: 'Receive structured week-by-week learning guides detailing recommended study targets and courses.'
    }
  ];

  return (
    <div style={{ minHeight: '100% ', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Header />

        {/* Hero Section */}
        <section style={{
          textAlign: 'center',
          padding: '80px 0 60px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div className="glass-pane" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '30px',
            fontSize: '0.85rem',
            borderColor: 'var(--color-secondary)',
            boxShadow: 'var(--shadow-neon)'
          }}>
            <Sparkles size={14} color="var(--color-secondary)" />
            <span style={{ fontWeight: 600, letterSpacing: '0.5px' }}>NEXT-GEN CV EVALUATION</span>
          </div>

          <h1 style={{
            fontSize: '4.2rem',
            lineHeight: '1.1',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            Navigate Your Career with <br />
            <span className="gradient-text">CareerPilot AI</span>
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.2rem',
            lineHeight: '1.6',
            maxWidth: '640px',
            margin: '0 auto',
            fontFamily: 'var(--font-content)'
          }}>
            Upload your resume, get immediate ATS scores, identify critical skills gaps, mapping custom learning roadmaps and job roles automatically.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <Link to="/register" className="gradient-btn" style={{
              padding: '16px 36px',
              fontSize: '1.05rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none'
            }}>
              <span>Analyze Resume Now</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="secondary-btn" style={{
              padding: '16px 36px',
              fontSize: '1.05rem',
              borderRadius: '12px',
              textDecoration: 'none'
            }}>
              Explore Accounts
            </Link>
          </div>
        </section>

        {/* Interactive mock stats */}
        <section style={{ margin: '40px 0 100px 0' }}>
          <div className="glass-pane pulse-glow-box" style={{
            maxWidth: '850px',
            margin: '0 auto',
            padding: '4px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(0, 242, 254, 0.05) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.2)'
          }}>
            <div style={{
              background: '#0F121D',
              borderRadius: '16px',
              padding: '24px 32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', flex: '1', minWidth: '150px', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Evaluations Computed</span>
                <h3 style={{ fontSize: '2rem', color: '#ffffff' }}>45K+</h3>
              </div>
              <div style={{ display: 'flex', flex: '1', minWidth: '150px', flexDirection: 'column', gap: '8px', borderLeft: '1px solid var(--border-light)', paddingLeft: '20px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Average Score Gain</span>
                <h3 style={{ fontSize: '2rem', color: 'var(--color-secondary)' }}>+24%</h3>
              </div>
              <div style={{ display: 'flex', flex: '1', minWidth: '150px', flexDirection: 'column', gap: '8px', borderLeft: '1px solid var(--border-light)', paddingLeft: '20px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Analysis Speed</span>
                <h3 style={{ fontSize: '2rem', color: '#ffffff' }}>&lt; 5s</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Features list */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '30px',
          marginTop: '60px'
        }}>
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass-pane" style={{
                padding: '30px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(124, 58, 237, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(124, 58, 237, 0.2)'
                }}>
                  <Icon size={22} color="var(--color-secondary)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontWeight: 600 }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
