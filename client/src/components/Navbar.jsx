import React from 'react';
import { Mail, Settings, Home, ArrowUpRight, Briefcase } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const scrollToContact = (e) => {
    e.preventDefault();
    if (activePage !== 'home') {
      setActivePage('home');
      // Wait for page change to render then scroll
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  const scrollToWorks = (e) => {
    e.preventDefault();
    if (activePage !== 'home') {
      setActivePage('home');
      // Wait for page change to render then scroll
      setTimeout(() => {
        const workSection = document.getElementById('work');
        if (workSection) {
          workSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const workSection = document.getElementById('work');
      if (workSection) {
        workSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="nav-logo" onClick={() => setActivePage('home')}>
          <span className="logo-icon">Z</span>
          <span className="logo-text">Z-Media</span>
        </div>
        
        <ul className="nav-links">
          <li>
            <button 
              className={`nav-link-btn ${activePage === 'home' ? 'active' : ''}`}
              onClick={() => setActivePage('home')}
            >
              <Home size={18} />
              Home
            </button>
          </li>
          <li>
            <button 
              className="nav-link-btn"
              onClick={scrollToWorks}
            >
              <Briefcase size={18} />
              My Works
            </button>
          </li>
        </ul>
        
        <div className="nav-cta">
          <a href="#contact" onClick={scrollToContact} className="btn btn-primary btn-sm">
            <span>Get in Touch</span>
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      
      <style>{`
        .navbar {
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 72px;
          display: flex;
          align-items: center;
          transition: var(--transition-normal);
        }
        
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        
        .nav-logo {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          cursor: pointer;
          font-weight: 800;
          font-size: 22px;
          font-family: var(--font-heading);
          color: var(--primary);
        }
        
        .logo-icon {
          background-color: var(--accent);
          color: #ffffff;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 900;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }
        
        .logo-text {
          letter-spacing: -0.5px;
        }
        
        .nav-links {
          display: flex;
          list-style: none;
          gap: var(--space-lg);
          align-items: center;
        }
        
        .nav-link-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-heading);
          font-weight: 500;
          color: var(--secondary);
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 15px;
        }
        
        .nav-link-btn:hover {
          color: var(--accent);
          background-color: var(--bg-secondary);
        }
        
        .nav-link-btn.active {
          color: var(--accent);
          background-color: var(--accent-light);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .nav-cta {
            display: none;
          }
        }
        
        @media (max-width: 580px) {
          .logo-text {
            display: none;
          }
          .nav-links {
            gap: var(--space-xs);
          }
          .nav-link-btn {
            padding: 6px 10px;
            font-size: 13px;
            gap: 4px;
          }
          .nav-link-btn svg {
            width: 15px;
            height: 15px;
          }
        }
      `}</style>
    </nav>
  );
}
