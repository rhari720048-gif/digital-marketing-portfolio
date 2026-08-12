import React, { useEffect } from 'react';
import { X, Youtube, Instagram, ExternalLink, Calendar, User, Tag } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getInstagramEmbedUrl = (url) => {
    if (!url) return null;
    try {
      // Normalize URL
      const cleanUrl = url.split('?')[0];
      const urlObj = new URL(cleanUrl);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      
      // Look for p, reel, tv
      const typeIndex = pathParts.findIndex(part => part === 'p' || part === 'reel' || part === 'tv');
      if (typeIndex !== -1 && pathParts[typeIndex + 1]) {
        const mediaId = pathParts[typeIndex + 1];
        return `https://www.instagram.com/p/${mediaId}/embed`;
      }
    } catch (e) {
      console.error("Failed to parse Instagram URL:", e);
    }
    return null;
  };

  const ytId = getYoutubeId(project.link);
  const igEmbedUrl = getInstagramEmbedUrl(project.link);
  const isYoutube = !!ytId;
  const isInstagram = !!igEmbedUrl;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="modal-body">
          <div className="modal-media-pane">
            {isYoutube ? (
              <div className="iframe-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                  title={project.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            ) : isInstagram ? (
              <div className="instagram-container">
                <div className="iframe-wrapper ig-iframe">
                  <iframe
                    src={igEmbedUrl}
                    title={project.title}
                    frameBorder="0"
                    allowFullScreen
                    scrolling="no"
                  ></iframe>
                </div>
                <div className="ig-fallback-banner">
                  <p>Instagram embeds may require browser permissions or logins to play directly.</p>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    <Instagram size={14} />
                    <span>Watch reel on Instagram</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="media-fallback-preview">
                <img src={project.thumbnail} alt={project.title} className="fallback-img" />
                <div className="fallback-overlay">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <span>Visit Project Link</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            )}
          </div>
          
          <div className="modal-info-pane">
            <div className="modal-header-info">
              <span className="badge badge-blue">{project.platform}</span>
              <h2 className="modal-title">{project.title}</h2>
            </div>
            
            <div className="metadata-grid">
              <div className="meta-item">
                <User size={16} className="meta-icon" />
                <div>
                  <span className="meta-label">Client</span>
                  <span className="meta-value">{project.client}</span>
                </div>
              </div>
              
              <div className="meta-item">
                <Calendar size={16} className="meta-icon" />
                <div>
                  <span className="meta-label">Completed</span>
                  <span className="meta-value">{project.date}</span>
                </div>
              </div>
            </div>
            
            <div className="modal-description-section">
              <h3>Project Scope & Marketing Success</h3>
              <p>{project.description}</p>
            </div>
            
            <div className="modal-tags-section">
              <h3>Services Rendered</h3>
              <div className="modal-tags">
                {project.tags && project.tags.map((tag, i) => (
                  <span key={i} className="modal-tag-badge">
                    <Tag size={12} />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="modal-cta-footer">
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block">
                <span>View Original Post</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: var(--space-md);
        }
        
        .modal-content {
          background-color: var(--bg-primary);
          border-radius: 16px;
          width: 100%;
          max-width: 1000px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border);
        }
        
        .modal-close-btn {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          background-color: var(--bg-secondary);
          color: var(--primary);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          z-index: 10;
          transition: var(--transition-fast);
        }
        
        .modal-close-btn:hover {
          background-color: var(--primary);
          color: #ffffff;
          transform: rotate(90deg);
        }
        
        .modal-body {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          min-height: 500px;
        }
        
        .modal-media-pane {
          background-color: #000000;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          min-height: 350px;
        }
        
        .iframe-wrapper {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 aspect ratio */
          background-color: #000;
        }
        
        .iframe-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .ig-iframe {
          padding-top: 100%; /* square ratio for instagram embeds */
          max-height: 450px;
          overflow: hidden;
        }
        
        .instagram-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
        }
        
        .ig-fallback-banner {
          background-color: #121212;
          padding: var(--space-md);
          text-align: center;
          color: #888888;
          font-size: 13px;
          border-t: 1px solid #222;
        }
        
        .ig-fallback-banner p {
          margin-bottom: var(--space-sm);
        }
        
        .media-fallback-preview {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 400px;
          overflow: hidden;
        }
        
        .fallback-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .fallback-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-info-pane {
          padding: var(--space-xl);
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
          overflow-y: auto;
        }
        
        .modal-header-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-sm);
        }
        
        .modal-title {
          font-size: 24px;
          line-height: 1.2;
          color: var(--primary);
        }
        
        .metadata-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
          border-bottom: 1px solid var(--border);
          border-top: 1px solid var(--border);
          padding: var(--space-md) 0;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        
        .meta-icon {
          color: var(--accent);
        }
        
        .meta-label {
          display: block;
          font-size: 11px;
          color: var(--muted);
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .meta-value {
          font-size: 14px;
          font-weight: 700;
          color: var(--primary);
        }
        
        .modal-description-section h3,
        .modal-tags-section h3 {
          font-size: 14px;
          text-transform: uppercase;
          color: var(--secondary);
          margin-bottom: var(--space-sm);
          letter-spacing: 0.5px;
          font-family: var(--font-heading);
        }
        
        .modal-description-section p {
          font-size: 15px;
          color: var(--secondary);
          line-height: 1.6;
        }
        
        .modal-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-sm);
        }
        
        .modal-tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          color: var(--primary);
          font-family: var(--font-mono);
        }
        
        .modal-cta-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
        }
        
        .btn-block {
          width: 100%;
        }

        @media (max-width: 900px) {
          .modal-body {
            grid-template-columns: 1fr;
          }
          
          .modal-media-pane {
            min-height: auto;
          }
          
          .modal-info-pane {
            padding: var(--space-lg);
          }
        }
      `}</style>
    </div>
  );
}
