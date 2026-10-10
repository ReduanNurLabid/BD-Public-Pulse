import React, { useState, useEffect, useRef } from 'react';
import { Compass, BarChart3, BookOpen, ShieldCheck, Menu, X, Award, Languages } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import lightLogo from '../assets/light mode logo.svg';
import darkLogo from '../assets/dark mode logo.svg';
import { isNewVisitor } from '../lib/visitorSession';

export default function Navbar({ activeTab, onNavigate, liveVisitors, lang = 'bn', onToggleLang }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNew, setIsNew] = useState(isNewVisitor);

  useEffect(() => {
    const handleStatusChange = () => setIsNew(isNewVisitor());
    window.addEventListener('bdc_submission_status_changed', handleStatusChange);
    window.addEventListener('storage', handleStatusChange);
    return () => {
      window.removeEventListener('bdc_submission_status_changed', handleStatusChange);
      window.removeEventListener('storage', handleStatusChange);
    };
  }, []);

  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleNav = (tab) => {
    onNavigate(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header" lang={lang} ref={navRef}>
      <div className="navbar-inner">
        <div className="navbar-brand-row">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => onNavigate('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
        >
          <div 
            className="navbar-brand-logo"
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            <img 
              src={lightLogo} 
              alt="BD Political Compass Logo" 
              className="site-logo-light"
              style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.22)' }}
            />
            <img 
              src={darkLogo} 
              alt="BD Political Compass Logo" 
              className="site-logo-dark"
              style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.22)' }}
            />
          </div>
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="navbar-brand-title" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
              BD Political Compass
            </span>
            <div className="navbar-brand-subtitle" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
              {lang === 'bn'
                ? 'একটি স্বাধীন, নিরপেক্ষ এবং উন্মুক্ত গবেষণা প্রকল্প।'
                : 'An independent, impartial, and open research project.'}
            </div>
          </div>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="mobile-menu-btn" style={{ display: 'none' }}>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem' }}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className={`navbar-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          {/* Live Visitor Pill */}
          <div className="badge-tag font-latin" style={{
            background: 'rgba(5, 150, 105, 0.1)',
            borderColor: 'rgba(5, 150, 105, 0.25)',
            color: '#059669',
            padding: '0.35rem 0.85rem',
            fontWeight: 700
          }}>
            <span className="pulse-indicator" style={{ marginRight: '0.2rem' }}></span>
            <span>{lang === 'en' ? `${liveVisitors} Online` : `${liveVisitors} জন অনলাইন`}</span>
          </div>

          <button
            onClick={() => handleNav('home')}
            className={`btn-ghost ${activeTab === 'home' ? 'selected' : ''}`}
            style={{
              color: activeTab === 'home' ? '#D97706' : 'var(--text-secondary)',
              fontWeight: activeTab === 'home' ? 700 : 500,
              display: 'inline-flex',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <span>{lang === 'en' ? 'Home & Survey' : 'হোম ও মূল্যায়ন'}</span>
            {isNew && (
              <span
                className="nav-guide-dot"
                title={lang === 'en' ? 'New visitor: take the survey' : 'নতুন ভিজিটর: মূল্যায়ন শুরু করুন'}
                aria-label={lang === 'en' ? 'New visitor: survey available' : 'নতুন ভিজিটর: মূল্যায়ন চালু আছে'}
              />
            )}
          </button>

          <button
            onClick={() => handleNav('dashboard')}
            className="btn-ghost"
            style={{
              color: activeTab === 'dashboard' ? '#0284C7' : 'var(--text-secondary)',
              fontWeight: activeTab === 'dashboard' ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <BarChart3 size={17} />
            <span>{lang === 'en' ? 'Live Dashboard' : 'লাইভ ড্যাশবোর্ড'}</span>
          </button>

          <button
            onClick={() => handleNav('methodology')}
            className="btn-ghost"
            style={{
              color: activeTab === 'methodology' ? '#7C3AED' : 'var(--text-secondary)',
              fontWeight: activeTab === 'methodology' ? 700 : 500,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <BookOpen size={17} />
            <span>{lang === 'en' ? 'Methodology' : 'গবেষণা পদ্ধতি'}</span>
          </button>

          {/* The label shows the language this button will switch to. */}
          <button
            onClick={onToggleLang}
            className="btn-ghost"
            aria-label={lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
            title={lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
            lang={lang === 'bn' ? 'en' : 'bn'}
            style={{
              color: 'var(--text-secondary)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Languages size={17} />
            <span className={lang === 'bn' ? 'font-latin' : undefined}>
              {lang === 'bn' ? 'English' : 'বাংলা'}
            </span>
          </button>

          {/* Neumorphic Light/Dark Pill Theme Switch */}
          <ThemeToggle lang={lang} />
        </nav>
      </div>
    </header>
  );
}
