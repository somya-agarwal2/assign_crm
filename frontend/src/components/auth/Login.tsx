import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import API_URL from '../../config';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      localStorage.removeItem('crm_profileData');
      // Simulate API call to existing endpoint
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      login(response.data.access_token, response.data.refresh_token, response.data.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative' }}>
      
      {/* Back to Home Button */}
      <Link to="/" style={{ position: 'absolute', top: '32px', left: '32px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s ease' }} className="back-link-hover">
        <ArrowLeft size={16} /> Back to website
      </Link>

      <div style={{ width: '100%', maxWidth: '400px', padding: '32px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '32px', height: '32px' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <path d="M20 20 L80 80" stroke="#a7f3d0" strokeWidth="20" strokeLinecap="round" />
              <path d="M80 20 L20 80" stroke="#1f8f5d" strokeWidth="20" strokeLinecap="round" style={{ opacity: 0.9 }} />
            </svg>
          </div>
          <span style={{ color: 'white', fontSize: '20px', fontWeight: 800 }}>ENGAGEX<span style={{fontWeight: 400}}>AI</span></span>
        </div>

        <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Welcome back</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>Enter your credentials to access your workspace</p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '6px' }}>Work Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
              placeholder="sarah@company.com"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Password</label>
              <Link to="/forgot-password" style={{ color: '#10b981', fontSize: '12px', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}
                placeholder="••••••••"
              />
              <div onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-tertiary)' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <input type="checkbox" id="remember" style={{ accentColor: '#10b981' }} />
            <label htmlFor="remember" style={{ color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>Remember me for 30 days</label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ width: '100%', background: '#10b981', color: '#031B34', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Create workspace</Link>
        </div>
      </div>
    </div>
  );
};
