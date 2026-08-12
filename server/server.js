const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'genz@123';
const JWT_SECRET = process.env.JWT_SECRET || 'genz-marketing-secret-token-key-2026';

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data', 'projects.json');

// Helper to scrape title, description, and thumbnail from page HTML
function scrapeMetadata(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let title = '';
        const titleMatch = data.match(/<title>([^<]+)<\/title>/i) ||
                           data.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                           data.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim();
        }

        let description = '';
        const descMatch = data.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                          data.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i) ||
                          data.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                          data.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
        if (descMatch && descMatch[1]) {
          description = descMatch[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'").trim();
        }

        let thumbnail = '';
        const imageMatch = data.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                           data.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        if (imageMatch && imageMatch[1]) {
          thumbnail = imageMatch[1].replace(/&amp;/g, '&');
        }

        resolve({ title, description, thumbnail });
      });
    }).on('error', (err) => {
      console.error('Error scraping metadata:', err);
      resolve({ title: '', description: '', thumbnail: '' });
    });
  });
}

// Helper functions to read/write JSON
function readProjects() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      // Ensure folder and file exists
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading projects data:', err);
    return [];
  }
}

function writeProjects(projects) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(projects, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing projects data:', err);
    return false;
  }
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// API Routes

// 1. Get all projects
app.get('/api/projects', (req, res) => {
  const projects = readProjects();
  res.json(projects);
});

// 2. Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, message: 'Logged in successfully' });
  }

  res.status(401).json({ message: 'Incorrect admin password' });
});

// 3. Add a new project (Protected)
app.post('/api/projects', authenticateToken, async (req, res) => {
  let { title, client, category, platform, link, description, tags, thumbnail, date } = req.body;

  if (!category || !platform || !link) {
    return res.status(400).json({ message: 'Category, platform, and link are required' });
  }

  // Helper to extract YouTube ID
  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  let scraped = { title: '', description: '', thumbnail: '' };
  if (!title || !description || !thumbnail) {
    scraped = await scrapeMetadata(link);
  }

  const finalTitle = title || scraped.title || 'Portfolio Work';
  const finalDesc = description || scraped.description || '';
  
  let finalThumb = thumbnail || scraped.thumbnail;
  if (!finalThumb && platform.toLowerCase() === 'youtube') {
    const ytId = getYoutubeId(link);
    if (ytId) {
      finalThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
  }
  if (!finalThumb) {
    finalThumb = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80';
  }

  // Clean Instagram title wrapper if present
  let cleanTitle = finalTitle;
  if (cleanTitle.endsWith(' • Instagram photos and videos') || cleanTitle.endsWith(' • Instagram')) {
    cleanTitle = cleanTitle.replace(' • Instagram photos and videos', '').replace(' • Instagram', '');
  }

  // Extract client name if not provided
  let finalClient = client;
  if (!finalClient) {
    if (platform.toLowerCase() === 'youtube') {
      finalClient = 'YouTube Creator';
    } else if (platform.toLowerCase() === 'instagram') {
      const userMatch = cleanTitle.match(/Instagram: "([^"]+)"/) || cleanTitle.match(/^([^\(]+)\(@[^\)]+\)/);
      finalClient = (userMatch && userMatch[1]) ? userMatch[1].trim() : 'Instagram Partner';
    } else {
      finalClient = 'Client Partner';
    }
  }

  const projects = readProjects();
  const newProject = {
    id: uuidv4(),
    title: cleanTitle,
    client: finalClient,
    category,
    platform,
    link,
    description: finalDesc,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
    thumbnail: finalThumb,
    date: date || new Date().toISOString().split('T')[0]
  };

  projects.unshift(newProject);
  if (writeProjects(projects)) {
    res.status(201).json(newProject);
  } else {
    res.status(500).json({ message: 'Failed to save project' });
  }
});

// 4. Update an existing project (Protected)
app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, client, category, platform, link, description, tags, thumbnail, date } = req.body;

  const projects = readProjects();
  const index = projects.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const updatedProject = {
    ...projects[index],
    title: title || projects[index].title,
    client: client || projects[index].client,
    category: category || projects[index].category,
    platform: platform || projects[index].platform,
    link: link || projects[index].link,
    description: description !== undefined ? description : projects[index].description,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : projects[index].tags),
    thumbnail: thumbnail || projects[index].thumbnail,
    date: date || projects[index].date
  };

  projects[index] = updatedProject;
  if (writeProjects(projects)) {
    res.json(updatedProject);
  } else {
    res.status(500).json({ message: 'Failed to save project' });
  }
});

// 5. Delete a project (Protected)
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const projects = readProjects();
  const filteredProjects = projects.filter(p => p.id !== id);

  if (projects.length === filteredProjects.length) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (writeProjects(filteredProjects)) {
    res.json({ message: 'Project deleted successfully' });
  } else {
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// Serve frontend static files in production
const clientBuildPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('GenZ Digital Marketing Portfolio API is running. Build client static files to serve frontend.');
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
