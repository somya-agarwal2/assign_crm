import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', color: '#1e293b', textAlign: 'center' }}>Reset Password</h2>
        
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              If an account exists with that email, we've sent instructions to reset your password.
            </p>
            <Link to="/login" style={{ background: '#10b981', color: 'white', padding: '10px 24px', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px', textAlign: 'center' }}>Enter your email to receive a reset link.</p>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Work Email</label>
              <input required type="email" placeholder="admin@company.com" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#1e293b' }} />
            </div>
            <button type="submit" disabled={loading} style={{ background: '#10b981', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
            </button>
          </form>
        )}
        
        {!sent && (
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
            Remembered your password? <Link to="/login" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </div>
        )}
      </div>
    </div>
  );
};
