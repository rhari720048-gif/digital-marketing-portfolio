import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import { Play, Mic, Send, Share2, Award, Users, CheckCircle, Video, Layers } from 'lucide-react';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Contact Form State
  const [contactData, setContactData] = useState({ name: '', brand: '', email: '', service: 'video', message: '' });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch projects from Backend API
  useEffect(() => {
    fetch('/api/projects')
      .then(res => {
        if (!res.ok) throw new Error("Failed to load projects");
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setFilteredProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Could not retrieve projects list. Make sure the API server is running on port 5000.");
        setLoading(false);
      });
  }, []);

  // Filter projects by category
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === activeTab));
    }
  }, [activeTab, projects]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulating API call to submit lead
    setTimeout(() => {
      setSubmitting(false);
      setSubmitSuccess(true);
      setContactData({ name: '', brand: '', email: '', service: 'video', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1200);
  };

  const tabs = [
    { id: 'all', label: 'All Works' },
    { id: 'podcast_full', label: 'Full Podcasts' },
    { id: 'podcast_reels', label: 'Podcast Reels' },
    { id: 'podcast_intro', label: 'Podcast Intros' },
    { id: 'delivery', label: 'Client Deliveries' },
    { id: 'solar', label: 'Solar Work' },
    { id: 'shop', label: 'Shop Videos' },
    { id: 'ideas', label: 'puthu ideas' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-text-content">
            <div className="hero-badge badge badge-blue">⚡ GEN Z DIGITAL MARKETING AGENCY</div>
            <h1 className="hero-title">
              We Edit, Manage & <br />
              <span className="text-royal-blue">Scale Brands.</span>
            </h1>
            <p className="hero-description">
              High-retention video editing, scroll-stopping reels, podcast production, and daily social media account management. Designed for modern audiences.
            </p>
            <div className="hero-ctas">
              <a href="#work" className="btn btn-primary">
                <span>View Our Portfolio</span>
                <Play size={16} fill="#ffffff" />
              </a>
              <a href="#contact" className="btn btn-secondary">
                <span>Get a Free Proposal</span>
              </a>
            </div>
          </div>

          <div className="hero-stats-pane">
            <div className="stat-card">
              <span className="stat-number">10M+</span>
              <span className="stat-label">Views Generated</span>
            </div>
            <div className="stat-card featured-stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Daily Posting & Account Management</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">98%</span>
              <span className="stat-label">Client Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section" id="services">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge badge-blue">SERVICES</span>
            <h2>What We Do For Your Brand</h2>
            <p>End-to-end digital marketing solutions built to convert profile visits into loyal customers.</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon-box">
                <Video size={24} color="#ffffff" />
              </div>
              <h3>Video & Reels Edit</h3>
              <p>Fast-paced, hook-driven edits for TikTok, Reels, and YouTube. Optimized for maximum watch time and audience retention.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-box">
                <Mic size={24} color="#ffffff" />
              </div>
              <h3>Podcast Editing</h3>
              <p>Crisp audio leveling, multicam editing, and multi-channel clipping. We repurpose podcasts into dozens of mini-assets.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-box">
                <Users size={24} color="#ffffff" />
              </div>
              <h3>Account Management</h3>
              <p>Daily scheduling, comment engagement, and strategic content planning. We run your shop or personal channels completely hands-off.</p>
            </div>

            <div className="service-card">
              <div className="service-icon-box">
                <Layers size={24} color="#ffffff" />
              </div>
              <h3>Content Provision</h3>
              <p>Designing aesthetic carousels, custom templates, copywriting, and high-converting marketing posts for your daily grid.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section className="work-section" id="work">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-blue">MY WORKS</span>
            <h2>Portfolio & Creative Works</h2>
            <p>A compilation of our video editing, podcast production, and creative concepts. Filter by category and click any card to play the video.</p>
          </div>

          {/* Tabs Filter */}
          <div className="filter-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Loading / Error / Empty States */}
          {loading && (
            <div className="state-message">
              <div className="spinner"></div>
              <p>Loading projects...</p>
            </div>
          )}

          {error && (
            <div className="state-message error-message">
              <p>{error}</p>
              <button className="btn btn-secondary btn-sm" onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {!loading && !error && filteredProjects.length === 0 && (
            <div className="state-message empty-state">
              <p>No projects found in this category yet. Check back soon!</p>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && filteredProjects.length > 0 && (
            <div className="projects-grid animate-fade-in">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="container contact-container">
          <div className="contact-info">
            <span className="badge badge-blue">LET'S COLLAB</span>
            <h2>Ready to scale your social media presence?</h2>
            <p>Tell us about your brand. We will audit your current channels and send you a custom editing/management proposal within 24 hours.</p>

            <div className="benefits-list">
              <div className="benefit-item">
                <CheckCircle size={18} className="benefit-icon" />
                <span>Dedicated account manager & editor</span>
              </div>
              <div className="benefit-item">
                <CheckCircle size={18} className="benefit-icon" />
                <span>Fast 24-48 hours turnaround time</span>
              </div>
              <div className="benefit-item">
                <CheckCircle size={18} className="benefit-icon" />
                <span>Transparent pricing options</span>
              </div>
            </div>
          </div>

          <div className="contact-form-card">
            {submitSuccess ? (
              <div className="form-success-pane">
                <div className="success-icon-circle">
                  <CheckCircle size={36} color="var(--success)" />
                </div>
                <h3>Proposal Request Sent!</h3>
                <p>We've received your details. Check your email inbox shortly for our review message!</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={contactData.name}
                    onChange={e => setContactData({ ...contactData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="brand">Brand / Shop Name</label>
                  <input
                    type="text"
                    id="brand"
                    placeholder="e.g. TrendyBites Cafe"
                    value={contactData.brand}
                    onChange={e => setContactData({ ...contactData, brand: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="name@company.com"
                    value={contactData.email}
                    onChange={e => setContactData({ ...contactData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="service">Primary Service Needed</label>
                  <select
                    id="service"
                    value={contactData.service}
                    onChange={e => setContactData({ ...contactData, service: e.target.value })}
                  >
                    <option value="video">Video & Reels Editing</option>
                    <option value="podcast">Podcast Production</option>
                    <option value="social">Daily Account Management</option>
                    <option value="content">Content Provision & Layouts</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message / Details</label>
                  <textarea
                    id="message"
                    rows="4"
                    placeholder="Briefly describe what you're looking to build..."
                    value={contactData.message}
                    onChange={e => setContactData({ ...contactData, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                  {submitting ? 'Sending Request...' : 'Get Free Proposal'}
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <p>© {new Date().getFullYear()} Z-Media Agency. All rights reserved.</p>
          <div className="footer-links">
            <a href="#work">Our Work</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <style>{`
        /* Hero Section */
        .hero-section {
          padding: var(--space-3xl) 0;
          background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
          border-bottom: 1px solid var(--border);
        }
        
        .hero-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: var(--space-3xl);
        }
        
        .hero-text-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-md);
        }
        
        .hero-badge {
          margin-bottom: var(--space-xs);
        }
        
        .hero-title {
          font-size: 54px;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin-bottom: var(--space-xs);
        }
        
        .text-royal-blue {
          color: var(--accent);
        }
        
        .hero-description {
          font-size: 18px;
          color: var(--secondary);
          max-width: 500px;
          margin-bottom: var(--space-lg);
        }
        
        .hero-ctas {
          display: flex;
          gap: var(--space-md);
        }
        
        .hero-stats-pane {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        
        .stat-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
        }
        
        .featured-stat {
          border-color: var(--accent);
          background-color: var(--accent-light);
          box-shadow: var(--shadow-blue);
        }
        
        .stat-number {
          font-family: var(--font-heading);
          font-size: 36px;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
          margin-bottom: var(--space-xs);
        }
        
        .featured-stat .stat-number {
          color: var(--accent);
        }
        
        .stat-label {
          font-size: 14px;
          color: var(--secondary);
          font-weight: 500;
        }
        
        /* Services Section */
        .services-section {
          padding: var(--space-3xl) 0;
          background-color: var(--bg-primary);
        }
        
        .section-header {
          max-width: 600px;
          margin-bottom: var(--space-2xl);
        }
        
        .section-header.text-center {
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }
        
        .section-header h2 {
          font-size: 36px;
          margin: var(--space-sm) 0;
        }
        
        .section-header p {
          color: var(--secondary);
          font-size: 16px;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-lg);
        }
        
        .service-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: var(--space-xl);
          transition: var(--transition-spring);
        }
        
        .service-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent);
          background-color: var(--bg-primary);
          box-shadow: var(--shadow-blue);
        }
        
        .service-icon-box {
          background-color: var(--accent);
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-lg);
        }
        
        .service-card h3 {
          font-size: 20px;
          margin-bottom: var(--space-sm);
        }
        
        .service-card p {
          font-size: 14px;
          color: var(--secondary);
        }
        
        /* Work Section */
        .work-section {
          padding: var(--space-3xl) 0;
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        
        .filter-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
          margin-bottom: var(--space-2xl);
        }
        
        .tab-btn {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 14px;
          padding: 10px 20px;
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--secondary);
        }
        
        .tab-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
        }
        
        .tab-btn.active {
          background-color: var(--accent);
          border-color: var(--accent);
          color: #ffffff;
          box-shadow: var(--shadow-blue);
        }
        
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--space-lg);
        }
        
        /* States */
        .state-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-3xl) 0;
          color: var(--secondary);
          text-align: center;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: var(--space-md);
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .error-message {
          color: var(--destructive);
          gap: var(--space-md);
        }
        
        /* Contact Section */
        .contact-section {
          padding: var(--space-3xl) 0;
          background-color: var(--bg-primary);
        }
        
        .contact-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3xl);
          align-items: center;
        }
        
        .contact-info h2 {
          font-size: 36px;
          margin: var(--space-sm) 0;
        }
        
        .contact-info p {
          color: var(--secondary);
          font-size: 16px;
          margin-bottom: var(--space-xl);
        }
        
        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        
        .benefit-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-weight: 600;
        }
        
        .benefit-icon {
          color: var(--success);
        }
        
        .contact-form-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: var(--space-2xl);
          box-shadow: var(--shadow-sm);
        }
        
        .form-success-pane {
          text-align: center;
          padding: var(--space-xl) 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
        }
        
        .success-icon-circle {
          background-color: rgba(16, 185, 129, 0.1);
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: var(--primary);
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px var(--space-md);
          background-color: var(--bg-primary);
          transition: var(--transition-fast);
          font-size: 14px;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
        
        /* Footer */
        .footer {
          padding: var(--space-xl) 0;
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border);
          font-size: 14px;
          color: var(--secondary);
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .footer-links {
          display: flex;
          gap: var(--space-lg);
        }
        
        .footer-links a:hover {
          color: var(--accent);
        }

        @media (max-width: 900px) {
          .hero-container,
          .contact-container {
            grid-template-columns: 1fr;
            gap: var(--space-2xl);
          }
          
          .hero-title {
            font-size: 40px;
          }
          
          .hero-stats-pane {
            flex-direction: row;
            flex-wrap: wrap;
          }
          
          .stat-card {
            flex: 1 1 200px;
          }
          
          .footer-content {
            flex-direction: column;
            gap: var(--space-md);
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
