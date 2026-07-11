import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowRight, BarChart3, Zap, Workflow, Users, ShieldCheck, PlayCircle, CheckCircle2,
  Sparkles, TrendingUp, Target, Megaphone, GitBranch, DollarSign, ChevronRight,
  Menu, X, HelpCircle, MessageSquare, Award, Flame, Lightbulb, Eye, Brain, LineChart, Globe, Activity
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const glowStyle = {
  boxShadow: '0 0 40px rgba(16, 185, 129, 0.15), 0 0 20px rgba(16, 185, 129, 0.1)',
};

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.02)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
};

const gradientText = {
  background: 'linear-gradient(to right, #ffffff, #a7f3d0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: "'Inter', sans-serif", overflowX: 'hidden', position: 'relative' }}>
      
      {/* Background Gradients & Noise */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '50vh', background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.15) 0%, rgba(2, 6, 23, 0) 70%)', filter: 'blur(60px)' }}></div>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(circle at center, black, transparent 80%)', WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)' }}></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px 40px', 
          position: 'fixed', 
          top: scrolled ? '16px' : '0',
          left: scrolled ? '16px' : '0',
          right: scrolled ? '16px' : '0',
          zIndex: 100, 
          background: scrolled ? 'rgba(2, 6, 23, 0.7)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          border: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
          borderRadius: scrolled ? '100px' : '0',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.2)' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '32px', height: '32px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3), inset 0 1px 1px rgba(255,255,255,0.2)' }}>
            <Sparkles size={16} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.03em', color: 'white' }}>EngageX</span>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '6px 24px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.05)' }}>
          {['Features', 'Intelligence', 'Customers', 'Pricing'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='#94a3b8'}>{item}</a>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='#94a3b8'}>Log in</Link>
          <Link to={isAuthenticated ? "/dashboard" : "/signup"} style={{ background: 'white', color: '#020617', padding: '10px 20px', borderRadius: '100px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(255,255,255,0.1)' }} onMouseEnter={e => { e.currentTarget.style.transform='scale(1.05)'; }} onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; }}>
            {isAuthenticated ? 'Dashboard' : 'Get Started'}
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '180px', paddingBottom: '100px', zIndex: 1 }}>
        <motion.div 
          style={{ y: yHero, opacity: opacityHero, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '900px', padding: '0 24px' }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 16px', borderRadius: '100px', marginBottom: '32px' }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#34d399', letterSpacing: '0.02em' }}>Introducing EngageX 2.0 AI Command Center</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: '72px', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', margin: '0 0 24px 0', ...gradientText }}
          >
            Marketing OS<br />Built for the Future.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: '20px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 48px 0', maxWidth: '640px', fontWeight: 400 }}
          >
            Orchestrate omnichannel journeys, uncover predictive insights, and let autonomous AI execute campaigns that drive revenue—all in one premium workspace.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: 'flex', gap: '20px' }}
          >
            <Link to={isAuthenticated ? "/dashboard" : "/signup"} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: '#020617', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', fontSize: '15px', fontWeight: 600, transition: 'all 0.3s', ...glowStyle }} onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 0 50px rgba(16, 185, 129, 0.4), 0 0 20px rgba(16, 185, 129, 0.2)'; }} onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 0 40px rgba(16, 185, 129, 0.15), 0 0 20px rgba(16, 185, 129, 0.1)'; }}>
              Start Building <ArrowRight size={18} />
            </Link>
            <button style={{ ...glassStyle, color: 'white', padding: '16px 32px', borderRadius: '12px', fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.background='rgba(255, 255, 255, 0.05)'; e.currentTarget.style.transform='translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.background='rgba(255, 255, 255, 0.02)'; e.currentTarget.style.transform='translateY(0)'; }}>
              <PlayCircle size={18} /> View Demo
            </button>
          </motion.div>
        </motion.div>

        {/* High-Fidelity Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 100, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '90%', maxWidth: '1200px', height: '700px', marginTop: '80px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', background: '#09090b', boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8), 0 0 80px rgba(16, 185, 129, 0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', perspective: '1000px' }}
        >
          {/* Mockup Header */}
          <div style={{ height: '48px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px', background: 'rgba(255, 255, 255, 0.02)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', opacity: 0.5 }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', opacity: 0.5 }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', opacity: 0.5 }}></div>
            <div style={{ margin: '0 auto', fontSize: '12px', color: '#52525b', fontWeight: 500, fontFamily: 'monospace' }}>engagex.app / dashboard</div>
          </div>
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Mockup Sidebar */}
            <div style={{ width: '240px', borderRight: '1px solid rgba(255, 255, 255, 0.05)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', borderRadius: '6px' }}></div>
                <div style={{ width: '120px', height: '14px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', background: i === 1 ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: i === 1 ? '#10b981' : 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ width: i === 3 ? '60%' : i === 5 ? '90%' : '75%', height: '10px', background: i === 1 ? 'white' : 'rgba(255,255,255,0.2)', borderRadius: '4px' }}></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mockup Main */}
            <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#09090b', overflow: 'hidden', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ width: '200px', height: '24px', background: 'rgba(255,255,255,0.9)', borderRadius: '6px', marginBottom: '8px' }}></div>
                  <div style={{ width: '300px', height: '12px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px' }}></div>
                </div>
                <div style={{ width: '120px', height: '36px', background: '#10b981', borderRadius: '8px' }}></div>
              </div>

              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {[
                  { title: 'Total Revenue', value: '$2,459,230', trend: '+14%' },
                  { title: 'Active Customers', value: '14,392', trend: '+5%' },
                  { title: 'Conversion Rate', value: '24.8%', trend: '+2.1%' },
                  { title: 'Churn Risk', value: '1.2%', trend: '-0.4%' }
                ].map((kpi, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '13px', color: '#a1a1aa' }}>{kpi.title}</div>
                    <div style={{ fontSize: '28px', color: 'white', fontWeight: 600, letterSpacing: '-0.5px' }}>{kpi.value}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981' }}><TrendingUp size={14} /> {kpi.trend} vs last month</div>
                  </div>
                ))}
              </div>

              {/* Charts area */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', flex: 1, minHeight: '300px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '150px', height: '16px', background: 'rgba(255,255,255,0.6)', borderRadius: '4px', marginBottom: '32px' }}></div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px', position: 'relative' }}>
                    {/* Grid lines */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                    <div style={{ position: 'absolute', top: '33%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                    <div style={{ position: 'absolute', top: '66%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
                    
                    {[35, 45, 30, 60, 55, 70, 65, 85, 75, 90, 80, 100].map((h, i) => (
                      <div key={i} style={{ width: '24px', height: `${h}%`, background: 'linear-gradient(to top, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.8))', borderRadius: '4px 4px 0 0', position: 'relative', zIndex: 1 }}>
                        <div style={{ position: 'absolute', top: '-4px', left: 0, right: 0, height: '4px', background: '#34d399', borderRadius: '4px' }}></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ width: '120px', height: '16px', background: 'rgba(255,255,255,0.6)', borderRadius: '4px', marginBottom: '8px' }}></div>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `rgba(255,255,255,${0.1 - i * 0.01})` }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ width: '80px', height: '10px', background: 'rgba(255,255,255,0.5)', borderRadius: '4px' }}></div>
                          <div style={{ width: '120px', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}></div>
                        </div>
                      </div>
                      <div style={{ width: '40px', height: '12px', background: 'rgba(16, 185, 129, 0.4)', borderRadius: '4px' }}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Glow over the mockup */}
            <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 60%)', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
          </div>
        </motion.div>
      </section>

      {/* Trusted By */}
      <section style={{ padding: '60px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
          <p style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Powering Next-Gen Growth Teams</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '64px', flexWrap: 'wrap', opacity: 0.5, filter: 'grayscale(100%) contrast(150%) brightness(150%)' }}>
            {['Acme Corp', 'GlobalScale', 'Innovate', 'NexTech', 'Vertex'].map((brand, i) => (
              <span key={i} style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.05em', color: 'white' }}>{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '160px 40px', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 24px 0', ...gradientText }}>Engineered for Precision</h2>
            <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>An integrated suite of tools designed to build complex journeys, surface deep insights, and automate workflows securely.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { icon: Zap, title: 'AI Command Center', desc: 'Autonomous intelligence that continuously learns and executes campaign optimizations.' },
              { icon: GitBranch, title: 'Journey Orchestration', desc: 'Drag-and-drop canvas for complex, multi-stage lifecycle marketing campaigns.' },
              { icon: Target, title: 'Dynamic Segmentation', desc: 'Real-time audiences powered by behavioral triggers and predictive scores.' },
              { icon: Activity, title: 'Real-time Analytics', desc: 'Sub-second queries across millions of events with rich visualization.' },
              { icon: ShieldCheck, title: 'Enterprise RBAC', desc: 'Granular role-based access control built for security and compliance.' },
              { icon: Globe, title: 'Omnichannel Delivery', desc: 'Native integrations for Email, SMS, WhatsApp, and in-app messaging.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                style={{ 
                  ...glassStyle,
                  borderRadius: '20px',
                  padding: '40px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(16, 185, 129, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                {/* Subtle top gradient line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent)' }}></div>
                
                <div style={{ width: '48px', height: '48px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <feature.icon size={24} color="#34d399" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px 0', color: 'white' }}>{feature.title}</h3>
                  <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Section */}
      <section id="intelligence" style={{ padding: '160px 40px', background: 'linear-gradient(to bottom, #020617, #09090b)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '160px' }}>
          
          {/* Feature 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              <div style={{ display: 'inline-flex', padding: '6px 12px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#34d399', fontSize: '12px', fontWeight: 600, marginBottom: '24px' }}>Autonomous Intelligence</div>
              <h3 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 24px 0', color: 'white', lineHeight: 1.1 }}>Operate at the speed of thought.</h3>
              <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 32px 0' }}>EngageX analyzes your workspace data to proactively suggest optimizations. Approve campaigns, tweak audiences, and deploy strategies with a single click.</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: 0, margin: 0, listStyle: 'none' }}>
                {['Predictive LTV scoring', 'Churn risk identification', 'Generative A/B testing'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#cbd5e1' }}>
                    <CheckCircle2 size={20} color="#10b981" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} style={{ position: 'relative' }}>
              <div style={{ ...glassStyle, padding: '32px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>// Command Execution Log</div>
                  <div style={{ background: '#020617', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace', fontSize: '13px' }}>
                    <div style={{ color: '#10b981' }}>&gt; analyzing_cohort(type="high_churn_risk")</div>
                    <div style={{ color: '#94a3b8' }}>[SUCCESS] 4,291 profiles identified.</div>
                    <div style={{ color: '#10b981' }}>&gt; generate_recovery_journey(channel="sms")</div>
                    <div style={{ color: '#94a3b8' }}>[DRAFTING] Creating 3 variants based on past engagement...</div>
                    <div style={{ color: 'white', marginTop: '8px' }}>✓ Journey "Q3 Recovery" ready for approval.</div>
                  </div>
                </div>
              </div>
              {/* Decorative blob */}
              <div style={{ position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%', background: '#10b981', filter: 'blur(80px)', opacity: 0.2, zIndex: 1 }}></div>
            </motion.div>
          </div>

          {/* Feature 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} style={{ position: 'relative', order: 1 }}>
              <div style={{ ...glassStyle, padding: '32px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative', zIndex: 2, height: '300px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Simplified Journey Graph */}
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '10%', width: '40px', height: '40px', background: '#3b82f6', borderRadius: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} color="white" /></div>
                    <div style={{ position: 'absolute', top: '50%', left: 'calc(10% + 40px)', width: 'calc(40% - 40px)', height: '2px', background: 'rgba(255,255,255,0.2)', transform: 'translateY(-50%)' }}></div>
                    <div style={{ position: 'absolute', top: '20%', left: '50%', width: '40px', height: '40px', background: '#f59e0b', borderRadius: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={20} color="white" /></div>
                    <div style={{ position: 'absolute', top: '80%', left: '50%', width: '40px', height: '40px', background: '#10b981', borderRadius: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><DollarSign size={20} color="white" /></div>
                    
                    {/* Paths */}
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                      <path d="M 30% 50% L 50% 20%" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                      <path d="M 30% 50% L 50% 80%" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                      <path d="M 50% 20% L 80% 50%" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4" />
                      <path d="M 50% 80% L 80% 50%" fill="none" stroke="rgba(16,185,129,0.5)" strokeWidth="2" />
                    </svg>
                    
                    <div style={{ position: 'absolute', top: '50%', left: '80%', width: '40px', height: '40px', background: '#8b5cf6', borderRadius: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}><Award size={20} color="white" /></div>
                  </div>
                </div>
              </div>
              <div style={{ position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%', background: '#3b82f6', filter: 'blur(80px)', opacity: 0.15, zIndex: 1 }}></div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} style={{ order: 2 }}>
              <div style={{ display: 'inline-flex', padding: '6px 12px', borderRadius: '6px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontSize: '12px', fontWeight: 600, marginBottom: '24px' }}>Visual Orchestration</div>
              <h3 style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 24px 0', color: 'white', lineHeight: 1.1 }}>Journeys that adapt in real-time.</h3>
              <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 32px 0' }}>Build infinite branch logic visually. When a customer interacts on one channel, their entire path recalibrates seamlessly across all other touchpoints.</p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: 0, margin: 0, listStyle: 'none' }}>
                {['Cross-channel synchronization', 'Behavioral event triggers', 'A/B/n split testing inline'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px', color: '#cbd5e1' }}>
                    <CheckCircle2 size={20} color="#3b82f6" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '160px 40px', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 24px 0', ...gradientText }}>Predictable Pricing</h2>
            <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>Transparent tiers designed to scale from ambitious startups to global enterprises.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'center' }}>
            {[
              { name: 'Starter', price: '$49', desc: 'Core CRM tools to get off the ground.', features: ['10,000 Profiles', 'Email Campaigns', 'Standard Analytics'] },
              { name: 'Professional', price: '$199', desc: 'Advanced orchestration for scaling teams.', features: ['100,000 Profiles', 'Omnichannel Journeys', 'AI Strategist Access', 'A/B Testing'], popular: true },
              { name: 'Enterprise', price: 'Custom', desc: 'Maximum security and white-glove support.', features: ['Unlimited Profiles', 'Dedicated Infrastructure', 'Custom RBAC Roles', 'SLA Guarantee'] }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{
                  ...glassStyle,
                  background: plan.popular ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: plan.popular ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '24px',
                  padding: '48px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px',
                  position: 'relative',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                  zIndex: plan.popular ? 2 : 1,
                  boxShadow: plan.popular ? '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(16, 185, 129, 0.1)' : 'none'
                }}
              >
                {plan.popular && (
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: '#10b981', color: '#020617', padding: '6px 16px', borderRadius: '100px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.05em' }}>
                    MOST POPULAR
                  </div>
                )}
                
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px 0', color: 'white' }}>{plan.name}</h3>
                  <p style={{ fontSize: '15px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{plan.desc}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '56px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{plan.price}</span>
                  {plan.price !== 'Custom' && <span style={{ fontSize: '16px', color: '#64748b' }}>/mo</span>}
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: 0, margin: 0, listStyle: 'none', flex: 1 }}>
                  {plan.features.map((feature, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px', color: '#cbd5e1' }}>
                      <CheckCircle2 size={18} color={plan.popular ? '#10b981' : '#64748b'} /> {feature}
                    </li>
                  ))}
                </ul>

                <button style={{
                  background: plan.popular ? 'white' : 'rgba(255,255,255,0.05)',
                  color: plan.popular ? '#020617' : 'white',
                  border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginTop: '16px'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '160px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at bottom, rgba(16, 185, 129, 0.15) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          <h2 style={{ fontSize: '56px', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 24px 0', ...gradientText }}>Ready to elevate your marketing?</h2>
          <p style={{ fontSize: '20px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 48px 0' }}>Join industry leaders who rely on EngageX to orchestrate data, automate intelligence, and accelerate revenue.</p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to={isAuthenticated ? "/dashboard" : "/signup"} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#020617', padding: '18px 36px', borderRadius: '12px', textDecoration: 'none', fontSize: '16px', fontWeight: 600, transition: 'all 0.3s', ...glowStyle }} onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}>
              Start for free <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Premium Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '80px 40px 40px 40px', background: '#020617' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '64px', marginBottom: '80px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '24px', height: '24px', background: '#10b981', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={14} color="white" />
                </div>
                <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.03em', color: 'white' }}>EngageX</span>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>The enterprise marketing operating system. Built with precision in San Francisco.</p>
            </div>
            
            {[
              { title: 'Product', links: ['Features', 'Integrations', 'Pricing', 'Changelog'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Blog', 'Community'] },
              { title: 'Company', links: ['About', 'Careers', 'Legal', 'Contact'] }
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'white', margin: '0 0 24px 0' }}>{col.title}</h4>
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {col.links.map(link => (
                    <li key={link}><a href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='#64748b'}>{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div style={{ paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
            <div>© 2026 EngageX Inc.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
              All systems normal
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
