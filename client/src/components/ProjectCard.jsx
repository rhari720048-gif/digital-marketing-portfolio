import React from 'react';
import { Youtube, Instagram, Play, ExternalLink, ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onClick }) {
  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return <Youtube size={16} className="platform-icon yt" />;
      case 'instagram':
        return <Instagram size={16} className="platform-icon ig" />;
      default:
        return <ExternalLink size={16} className="platform-icon generic" />;
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'podcast_full':
        return 'Full Podcast';
      case 'podcast_reels':
        return 'Podcast Reel';
      case 'podcast_intro':
        return 'Podcast Intro';
      case 'delivery':
        return 'Client Delivery';
      case 'solar':
        return 'Solar Video';
      case 'shop':
        return 'Shop Video';
      case 'ideas':
        return 'pudhu ideas';
      default:
        return category;
    }
  };

  return (
    <div className="project-card" onClick={onClick}>
      <div className="card-image-container">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80";
          }}
        />
        <div className="card-overlay">
          <div className="play-button-circle">
            <Play size={24} fill="#ffffff" color="#ffffff" className="play-icon" />
          </div>
        </div>
        <div className="card-platform-badge">
          {getPlatformIcon(project.platform)}
          <span>{project.platform}</span>
        </div>
      </div>

      <div className="card-content">
        <div className="card-meta">
          <span className="card-category">{getCategoryLabel(project.category)}</span>
          <span className="card-date">{project.date}</span>
        </div>

        <h3 className="card-title">{project.title}</h3>
        <p className="card-client">Client: <strong>{project.client}</strong></p>
        <p className="card-description">{project.description}</p>

        <div className="card-tags">
          {project.tags && project.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="card-tag">#{tag}</span>
          ))}
        </div>

        <div className="card-action">
          <span>View Project Work</span>
          <ArrowRight size={16} className="action-arrow" />
        </div>
      </div>

      <style>{`
        .project-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          transition: var(--transition-spring);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
        }
        
        .project-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent);
          box-shadow: var(--shadow-blue);
        }
        
        .card-image-container {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          overflow: hidden;
          background-color: var(--bg-tertiary);
        }
        
        .card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-slow);
        }
        
        .project-card:hover .card-image {
          transform: scale(1.05);
        }
        
        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: var(--transition-normal);
        }
        
        .project-card:hover .card-overlay {
          opacity: 1;
        }
        
        .play-button-circle {
          background-color: var(--accent);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
          transform: scale(0.8);
          transition: var(--transition-spring);
        }
        
        .project-card:hover .play-button-circle {
          transform: scale(1);
        }
        
        .play-icon {
          margin-left: 4px;
        }
        
        .card-platform-badge {
          position: absolute;
          top: var(--space-sm);
          left: var(--space-sm);
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          padding: 4px 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          font-family: var(--font-heading);
          color: var(--primary);
          box-shadow: var(--shadow-sm);
        }
        
        .platform-icon.yt {
          color: #ff0000;
        }
        
        .platform-icon.ig {
          color: #e1306c;
        }
        
        .platform-icon.generic {
          color: var(--accent);
        }
        
        .card-content {
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        
        .card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--secondary);
          margin-bottom: var(--space-xs);
          font-family: var(--font-mono);
        }
        
        .card-category {
          color: var(--accent);
          font-weight: 600;
        }
        
        .card-title {
          font-size: 18px;
          margin-bottom: 4px;
          line-height: 1.3;
        }
        
        .card-client {
          font-size: 13px;
          color: var(--secondary);
          margin-bottom: var(--space-md);
        }
        
        .card-description {
          font-size: 14px;
          color: var(--secondary);
          margin-bottom: var(--space-lg);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex-grow: 1;
        }
        
        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
          margin-bottom: var(--space-lg);
        }
        
        .card-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
          background-color: var(--bg-secondary);
          padding: 2px 6px;
          border-radius: 4px;
        }
        
        .card-action {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          font-size: 14px;
          font-weight: 700;
          color: var(--accent);
          font-family: var(--font-heading);
          margin-top: auto;
          transition: var(--transition-fast);
        }
        
        .project-card:hover .card-action {
          color: var(--accent-hover);
        }
        
        .action-arrow {
          transition: var(--transition-fast);
        }
        
        .project-card:hover .action-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
