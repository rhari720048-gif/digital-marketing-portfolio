import React, { useState, useEffect } from 'react';
import { LogIn, Plus, Trash2, Edit, X, Save, Lock, Layout, LogOut, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Admin({ setActivePage }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    category: 'podcast_full',
    platform: 'youtube',
    link: '',
    description: '',
    tags: '',
    thumbnail: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Verify stored token on load & clear legacy localStorage token
  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      localStorage.removeItem('adminToken');
    }
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      setIsLoggedIn(true);
      fetchProjects();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }
      sessionStorage.setItem('adminToken', data.token);
      setIsLoggedIn(true);
      setPassword('');
      fetchProjects();
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setProjects([]);
    if (setActivePage) {
      setActivePage('home');
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setActionError("Error fetching projects: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentProjectId(null);
    setFormData({
      title: '',
      client: '',
      category: 'podcast_full',
      platform: 'youtube',
      link: '',
      description: '',
      tags: '',
      thumbnail: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAdvanced(false);
    setIsFormOpen(true);
  };

  const openEditModal = (project) => {
    setIsEditMode(true);
    setCurrentProjectId(project.id);
    setFormData({
      title: project.title,
      client: project.client,
      category: project.category,
      platform: project.platform,
      link: project.link,
      description: project.description || '',
      tags: project.tags ? project.tags.join(', ') : '',
      thumbnail: project.thumbnail || '',
      date: project.date || new Date().toISOString().split('T')[0]
    });
    setShowAdvanced(true); // Open advanced sections automatically in edit mode
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    setActionError('');
    setActionSuccess('');
    const token = sessionStorage.getItem('adminToken');
    
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        throw new Error("Session expired. Please log in again.");
      }
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      
      setActionSuccess("Project deleted successfully!");
      fetchProjects();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');
    const token = sessionStorage.getItem('adminToken');

    const payload = {
      ...formData,
      // Parse comma-separated tags into array
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    };

    // Provide default thumbnail if left blank based on category
    if (!payload.thumbnail) {
      if (payload.category === 'video') {
        payload.thumbnail = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80';
      } else if (payload.category === 'podcast') {
        payload.thumbnail = 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80';
      } else {
        payload.thumbnail = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80';
      }
    }

    try {
      const url = isEditMode ? `/api/projects/${currentProjectId}` : '/api/projects';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401 || res.status === 403) {
        handleLogout();
        throw new Error("Session expired. Please log in again.");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');

      setActionSuccess(isEditMode ? "Project updated successfully!" : "New project added successfully!");
      setIsFormOpen(false);
      fetchProjects();
    } catch (err) {
      setActionError(err.message);
    }
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="admin-login-page">
        <div className="login-card animate-fade-in">
          <div className="lock-icon-circle">
            <Lock size={28} color="var(--accent)" />
          </div>
          <h2>Admin Access</h2>
          <p>Enter the password to access the project management dashboard.</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <input 
                type="password" 
                id="admin-password" 
                required 
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            
            {loginError && <div className="login-error-msg"><AlertTriangle size={14} />{loginError}</div>}
            
            <button type="submit" className="btn btn-primary btn-block">
              <LogIn size={16} />
              <span>Login Dashboard</span>
            </button>
          </form>
        </div>
        
        <style>{`
          .admin-login-page {
            min-height: calc(100vh - 72px);
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--bg-secondary);
            padding: var(--space-md);
          }
          
          .login-card {
            background-color: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: var(--space-2xl);
            width: 100%;
            max-width: 400px;
            text-align: center;
            box-shadow: var(--shadow-lg);
          }
          
          .lock-icon-circle {
            background-color: var(--accent-light);
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto var(--space-lg) auto;
          }
          
          .login-card h2 {
            font-size: 24px;
            margin-bottom: var(--space-xs);
          }
          
          .login-card p {
            font-size: 14px;
            color: var(--secondary);
            margin-bottom: var(--space-xl);
          }
          
          .login-form {
            text-align: left;
            display: flex;
            flex-direction: column;
            gap: var(--space-md);
          }
          
          .login-error-msg {
            background-color: #fee2e2;
            color: var(--destructive);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <div className="admin-dashboard-page container animate-fade-in">
        <div className="dashboard-header">
        <div>
          <span className="badge badge-blue">ADMIN CONSOLE</span>
          <h2>Project Dashboard</h2>
        </div>
        
        <div className="header-actions">
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={16} />
            <span>Add Project</span>
          </button>
          
          <button onClick={handleLogout} className="btn btn-secondary">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="alert alert-success">
          <CheckCircle size={16} />
          <span>{actionSuccess}</span>
          <button className="alert-close" onClick={() => setActionSuccess('')}><X size={14} /></button>
        </div>
      )}
      
      {actionError && (
        <div className="alert alert-error">
          <AlertTriangle size={16} />
          <span>{actionError}</span>
          <button className="alert-close" onClick={() => setActionError('')}><X size={14} /></button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-box">
          <span className="box-label">Total Portfolio Items</span>
          <span className="box-number">{projects.length}</span>
        </div>
        <div className="stat-box">
          <span className="box-label">YouTube Links</span>
          <span className="box-number">{projects.filter(p => p.platform === 'youtube').length}</span>
        </div>
        <div className="stat-box">
          <span className="box-label">Instagram Links</span>
          <span className="box-number">{projects.filter(p => p.platform === 'instagram').length}</span>
        </div>
      </div>

      {/* Table List of Projects */}
      <div className="table-container">
        {loading ? (
          <div className="table-loading">
            <div className="spinner"></div>
            <p>Fetching database files...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="table-empty">
            <Layout size={40} className="empty-icon" />
            <p>No projects registered. Click "Add Project" to insert your first one!</p>
          </div>
        ) : (
          <table className="projects-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Project Details</th>
                <th>Client</th>
                <th>Category</th>
                <th>Platform</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>
                    <img 
                      src={project.thumbnail} 
                      alt="" 
                      className="table-thumb" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&auto=format&fit=crop&q=80";
                      }}
                    />
                  </td>
                  <td>
                    <div className="table-project-info">
                      <span className="table-project-title">{project.title}</span>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="table-project-link">
                        Link: {project.link.length > 35 ? project.link.substring(0, 35) + '...' : project.link}
                      </a>
                    </div>
                  </td>
                  <td><span className="table-client-name">{project.client}</span></td>
                  <td><span className="table-category-label">{project.category}</span></td>
                  <td><span className="badge badge-blue">{project.platform}</span></td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => openEditModal(project)} className="action-btn edit-btn" title="Edit details">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="action-btn delete-btn" title="Delete project">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="form-modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="form-modal-card animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="form-modal-header">
              <h3>{isEditMode ? 'Edit Project Details' : 'Add New Portfolio Project'}</h3>
              <button onClick={() => setIsFormOpen(false)} className="close-btn"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="admin-form">
              <div className="form-row-double">
                <div className="form-group">
                  <label htmlFor="category">Category*</label>
                  <select 
                    id="category"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="podcast_full">Full Podcast</option>
                    <option value="podcast_reels">Podcast Reel</option>
                    <option value="podcast_intro">Podcast Intro</option>
                    <option value="delivery">Client Delivery</option>
                    <option value="solar">Solar Video</option>
                    <option value="shop">Shop Video</option>
                    <option value="ideas">pudhu ideas</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="platform">Platform*</label>
                  <select 
                    id="platform"
                    value={formData.platform}
                    onChange={e => setFormData({...formData, platform: e.target.value})}
                  >
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="other">Other / General Link</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="link">Project URL / Link*</label>
                <input 
                  type="url" 
                  id="link" 
                  required 
                  placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                  value={formData.link}
                  onChange={e => setFormData({...formData, link: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label htmlFor="desc">Scope of Work / Description (Optional)</label>
                <textarea 
                  id="desc" 
                  rows="3" 
                  placeholder="Leave blank to automatically generate/fetch description from link, or type it here..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div style={{ margin: 'var(--space-md) 0' }}>
                <button 
                  type="button" 
                  className="btn-outline-dashed"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <span>{showAdvanced ? 'Hide Advanced / Manual Override Fields' : 'Show Advanced / Manual Override Fields (Title, Client, Tags...)'}</span>
                </button>
              </div>

              {showAdvanced && (
                <div className="advanced-fields animate-fade-in" style={{ padding: 'var(--space-md)', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <div className="form-row-double">
                    <div className="form-group">
                      <label htmlFor="title">Project Title (Manual Override)</label>
                      <input 
                        type="text" 
                        id="title" 
                        placeholder="Automatically scraped if empty"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="client">Client Name (Manual Override)</label>
                      <input 
                        type="text" 
                        id="client" 
                        placeholder="Automatically scraped if empty"
                        value={formData.client}
                        onChange={e => setFormData({...formData, client: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-row-double">
                    <div className="form-group">
                      <label htmlFor="thumbnail">Thumbnail Image URL (Manual Override)</label>
                      <input 
                        type="url" 
                        id="thumbnail" 
                        placeholder="Automatically scraped if empty"
                        value={formData.thumbnail}
                        onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="date">Completion Date (Manual Override)</label>
                      <input 
                        type="date" 
                        id="date" 
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="tags">Services Rendered Tags (comma separated)</label>
                    <input 
                      type="text" 
                      id="tags" 
                      placeholder="Reels, Retention Hook, Sound Design"
                      value={formData.tags}
                      onChange={e => setFormData({...formData, tags: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="form-modal-footer">
                <button type="button" onClick={() => setIsFormOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  <span>{isEditMode ? 'Save Changes' : 'Publish Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-dashboard-page {
          padding: var(--space-2xl) var(--space-lg);
          min-height: calc(100vh - 72px);
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: var(--space-lg);
        }
        
        .dashboard-header h2 {
          font-size: 32px;
          margin-top: var(--space-xs);
        }
        
        .header-actions {
          display: flex;
          gap: var(--space-md);
        }
        
        /* Alerts */
        .alert {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          position: relative;
        }
        
        .alert-success {
          background-color: #ecfdf5;
          border: 1px solid #10b98140;
          color: var(--success);
        }
        
        .alert-error {
          background-color: #fee2e2;
          border: 1px solid #ef444440;
          color: var(--destructive);
        }
        
        .alert-close {
          position: absolute;
          right: var(--space-md);
          top: 50%;
          transform: translateY(-50%);
          color: inherit;
          opacity: 0.7;
        }
        
        .alert-close:hover {
          opacity: 1;
        }
        
        /* Stats row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-lg);
        }
        
        .stat-box {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
        }
        
        .box-label {
          font-size: 12px;
          color: var(--secondary);
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .box-number {
          font-size: 32px;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--accent);
          margin-top: 4px;
        }
        
        /* Table styles */
        .table-container {
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        
        .projects-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }
        
        .projects-table th {
          background-color: var(--bg-secondary);
          padding: var(--space-md);
          font-weight: 600;
          color: var(--secondary);
          border-bottom: 1px solid var(--border);
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.5px;
        }
        
        .projects-table td {
          padding: var(--space-md);
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }
        
        .projects-table tr:last-child td {
          border-bottom: none;
        }
        
        .table-thumb {
          width: 80px;
          height: 45px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid var(--border);
        }
        
        .table-project-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .table-project-title {
          font-weight: 700;
          color: var(--primary);
          font-size: 15px;
        }
        
        .table-project-link {
          color: var(--muted);
          font-size: 12px;
        }
        
        .table-project-link:hover {
          color: var(--accent);
          text-decoration: underline;
        }
        
        .table-client-name {
          font-weight: 600;
        }
        
        .table-category-label {
          text-transform: capitalize;
          color: var(--secondary);
        }
        
        .table-actions {
          display: flex;
          gap: var(--space-sm);
        }
        
        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          background-color: var(--bg-secondary);
        }
        
        .edit-btn:hover {
          background-color: var(--accent-light);
          color: var(--accent);
          border-color: var(--accent);
        }
        
        .delete-btn:hover {
          background-color: #fee2e2;
          color: var(--destructive);
          border-color: var(--destructive);
        }
        
        .table-loading,
        .table-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-3xl) 0;
          color: var(--secondary);
          text-align: center;
        }
        
        .empty-icon {
          color: var(--muted);
          margin-bottom: var(--space-md);
        }
        
        /* Modal Form */
        /* Modal Form */
        .form-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: var(--space-md);
        }
        
        .form-modal-card {
          background-color: var(--bg-primary);
          border-radius: 16px;
          border: 1px solid var(--border);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .form-modal-header {
          padding: var(--space-md) var(--space-lg);
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        
        .form-modal-header h3 {
          font-size: 18px;
        }
        
        .close-btn {
          color: var(--secondary);
        }
        
        .close-btn:hover {
          color: var(--primary);
        }
        
        .admin-form {
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          overflow-y: auto;
          flex-grow: 1;
        }
        
        .form-row-double {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }
        
        /* Premium Form Fields */
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }
        
        .form-group label {
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 600;
          color: var(--secondary);
          letter-spacing: 0.3px;
        }
        
        .form-group input[type="text"],
        .form-group input[type="url"],
        .form-group input[type="date"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background-color: var(--bg-primary);
          color: var(--primary);
          font-size: 14px;
          transition: all var(--transition-fast);
          outline: none;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
          background-color: #ffffff;
        }
        
        .form-group textarea {
          resize: vertical;
        }
        
        .btn-outline-dashed {
          background: transparent;
          border: 1.5px dashed var(--border);
          color: var(--secondary);
          padding: 12px 16px;
          border-radius: 8px;
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          transition: all var(--transition-fast);
        }
        
        .btn-outline-dashed:hover {
          border-color: var(--accent);
          color: var(--accent);
          background-color: var(--accent-light);
        }
        
        .form-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-md);
          border-top: 1px solid var(--border);
          padding-top: var(--space-lg);
          margin-top: var(--space-xs);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .form-row-double {
            grid-template-columns: 1fr;
          }
          
          .projects-table th:nth-child(1),
          .projects-table td:nth-child(1),
          .projects-table th:nth-child(3),
          .projects-table td:nth-child(3),
          .projects-table th:nth-child(4),
          .projects-table td:nth-child(4) {
            display: none;
          }
          
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-md);
          }
          
          .header-actions {
            width: 100%;
          }
          
          .header-actions button {
            flex-grow: 1;
          }
        }
        
        @media (max-width: 580px) {
          .form-modal-card {
            max-height: 95vh;
            border-radius: 12px;
          }
          .form-modal-header {
            padding: 12px 16px;
          }
          .form-modal-header h3 {
            font-size: 16px;
          }
          .admin-form {
            padding: 16px;
            gap: 12px;
          }
          .form-group label {
            font-size: 12px;
          }
          .form-group input[type="text"],
          .form-group input[type="url"],
          .form-group input[type="date"],
          .form-group select,
          .form-group textarea {
            padding: 10px 12px;
            font-size: 13px;
          }
          .form-modal-footer {
            padding-top: 12px;
            margin-top: var(--space-xs);
          }
          .btn-outline-dashed {
            padding: 10px 12px;
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}
