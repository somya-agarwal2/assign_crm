import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: '0 24px 60px rgba(0,0,0,0.4)', maxWidth: '400px' }}>
        <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', marginBottom: '24px' }}>
          <ShieldAlert size={48} color="#ef4444" />
        </div>
        <h1 style={{ color: 'white', fontSize: '24px', marginBottom: '12px' }}>Access Denied</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px', lineHeight: 1.5 }}>
          You do not have the required permissions to access this resource or perform this action.
        </p>
        <button 
          onClick={() => navigate('/')}
          style={{ background: '#10b981', color: '#031B34', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
