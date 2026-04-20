import React from 'react';
import { Link } from 'react-router-dom';

const featureCards = [
  {
    icon: '🚀',
    title: 'Innovation',
    description:
      'Work on cutting-edge projects that push boundaries and shape the future of technology.',
  },
  {
    icon: '📈',
    title: 'Growth',
    description:
      'Accelerate your career with mentorship programs, learning stipends, and clear advancement paths.',
  },
  {
    icon: '🤝',
    title: 'Culture',
    description:
      'Join a diverse, inclusive team that values collaboration, transparency, and work-life balance.',
  },
  {
    icon: '🌍',
    title: 'Impact',
    description:
      'Make a meaningful difference by building products that improve lives around the world.',
  },
];

function FeatureCard({ icon, title, description }) {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        textAlign: 'center',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1a1a2e',
          marginBottom: '12px',
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.6, margin: 0 }}>
        {description}
      </p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: '#ffffff',
          padding: '100px 24px',
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            marginBottom: '16px',
            lineHeight: 1.2,
            maxWidth: '700px',
          }}
        >
          Build Your Future With Us
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            color: '#b0c4de',
            marginBottom: '40px',
            maxWidth: '600px',
            lineHeight: 1.6,
          }}
        >
          Join a world-class team where your ideas matter, your growth is prioritized, and
          your work creates real impact.
        </p>
        <Link
          to="/apply"
          style={{
            display: 'inline-block',
            background: '#e94560',
            color: '#ffffff',
            padding: '16px 48px',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#d63851';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#e94560';
          }}
        >
          Apply Now
        </Link>
      </section>

      {/* Why Join Us Section */}
      <section
        style={{
          padding: '80px 24px',
          background: '#f5f7fa',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: '#1a1a2e',
            marginBottom: '12px',
          }}
        >
          Why Join Us
        </h2>
        <p
          style={{
            fontSize: '1.125rem',
            color: '#666',
            marginBottom: '48px',
            maxWidth: '550px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}
        >
          We offer more than just a job — we offer a place where you can thrive.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {featureCards.map((card) => (
            <FeatureCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section
        style={{
          padding: '80px 24px',
          background: '#1a1a2e',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '16px',
          }}
        >
          Ready to Take the Next Step?
        </h2>
        <p
          style={{
            fontSize: '1.125rem',
            color: '#b0c4de',
            marginBottom: '40px',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}
        >
          Start your onboarding journey today and become part of something extraordinary.
        </p>
        <Link
          to="/apply"
          style={{
            display: 'inline-block',
            background: '#e94560',
            color: '#ffffff',
            padding: '16px 48px',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#d63851';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#e94560';
          }}
        >
          Apply Now
        </Link>
      </section>
    </div>
  );
}