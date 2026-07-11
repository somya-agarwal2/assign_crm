import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import API_URL from '../../config';

export const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    workspaceName: '',
    adminName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    industry: 'Technology',
    country: 'United States',
    timezone: 'UTC'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const requestUrl = `${API_URL}/workspaces/onboard`;
      const requestPayload = { ...formData };

      console.log('[Signup] VITE_API_URL:', import.meta.env.VITE_API_URL);
      console.log('[Signup] request URL:', requestUrl);
      console.log('[Signup] request payload:', requestPayload);

      const response = await axios.post(requestUrl, requestPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('[Signup] response status:', response.status);
      console.log('[Signup] response body:', response.data);
      
      localStorage.removeItem('crm_profileData'); // Clear old hardcoded profile cache

      // Response contains access_token and user info
      login(response.data.access_token, response.data.refresh_token, response.data.user);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosError = axios.isAxiosError(err) ? err : null;
      console.log('[Signup] network error:', axiosError || err);
      console.log('[Signup] response status:', axiosError?.response?.status ?? 'NO_RESPONSE');
      console.log('[Signup] response body:', axiosError?.response?.data ?? null);

      const backendError = axiosError?.response?.data?.error;
      const fallbackError = axiosError?.message || 'Failed to create workspace. Please try again.';
      setError(backendError || fallbackError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#020b14', color: 'white', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Left Side - Marketing/Branding */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '64px', background: 'radial-gradient(circle at top left, rgba(16,185,129,0.15) 0%, rgba(2,11,20,1) 60%)', borderRight: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        
        {/* Back Button */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500, marginBottom: '32px', transition: 'color 0.2s ease' }} className="back-link-hover">
          <ArrowLeft size={16} /> Back to website
        </Link>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'white', marginBottom: 'auto' }}>
          <div style={{ width: '32px', height: '32px' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <path d="M20 20 L80 80" stroke="#a7f3d0" strokeWidth="20" strokeLinecap="round" />
              <path d="M80 20 L20 80" stroke="#10b981" strokeWidth="20" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '0.5px' }}>ENGAGEX<span style={{ fontWeight: 400 }}>AI</span></span>
        </Link>
        
        <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px' }}>
            Scale your <br /> customer engagement.
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '400px', marginBottom: '40px' }}>
            Join thousands of modern B2B SaaS companies using EngageX to drive revenue through autonomous AI.
          </p>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px', width: '200px' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#10b981', marginBottom: '8px' }}>14d</div>
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>Free trial on all plans</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px', width: '200px' }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#3b82f6', marginBottom: '8px' }}>0</div>
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>Credit card required</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Create your Workspace</h2>
          <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Start your 14-day free trial. No credit card required.</p>
          
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Company Name *</label>
                <input required name="companyName" value={formData.companyName} onChange={handleChange} type="text" placeholder="Acme Corp" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Workspace Name *</label>
                <input required name="workspaceName" value={formData.workspaceName} onChange={handleChange} type="text" placeholder="Acme Marketing" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '14px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Admin Name *</label>
                <input required name="adminName" value={formData.adminName} onChange={handleChange} type="text" placeholder="John Smith" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Business Email *</label>
                <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="john@acme.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '14px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Password *</label>
                <input required name="password" value={formData.password} onChange={handleChange} type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Confirm Password *</label>
                <input required name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '14px' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Phone Number</label>
              <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+1 (555) 000-0000" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '14px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Industry</label>
                <select name="industry" value={formData.industry} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '14px', appearance: 'none' }}>
                  <option value="Technology">Technology</option>
                  <option value="Retail">Retail</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Country</label>
                <select name="country" value={formData.country} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '14px', appearance: 'none' }}>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="India">India</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px', fontWeight: 500 }}>Timezone</label>
                <select name="timezone" value={formData.timezone} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '14px', appearance: 'none' }}>
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                  <option value="IST">IST</option>
                  <option value="CET">CET</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ background: '#10b981', color: '#020b14', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Workspace <ArrowRight size={18} /></>}
            </button>
          </form>
          
          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
            Already have a workspace? <Link to="/login" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </div>
        </div>
      </div>
      
    </div>
  );
};
