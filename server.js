const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_db';

let isMongoConnected = false;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB database!');
    isMongoConnected = true;
    seedInitialProjects();
  })
  .catch(err => {
    console.warn('MongoDB connection warning:', err.message);
    console.warn('Backend server running in API mode with in-memory store fallback if DB unavailable.');
  });

// Mongoose Schemas & Models
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], required: true },
  projectLink: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);

const linkedinPostSchema = new mongoose.Schema({
  authorName: { type: String, default: 'Chethiya Samaradiwakara' },
  authorTitle: { type: String, default: 'Undergraduate at USJ | Vice Chairperson IEEE CS' },
  authorAvatar: { type: String, default: 'personal_photo.jpg' },
  postText: { type: String, required: true },
  postImage: { type: String, default: '' },
  postLink: { type: String, default: 'https://www.linkedin.com/in/chethiya-samaradiwakara-11a816322/' },
  embedUrl: { type: String, default: '' },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

const LinkedinPost = mongoose.model('LinkedinPost', linkedinPostSchema);

const linkedinConfigSchema = new mongoose.Schema({
  widgetScript: { type: String, default: '' },
  feedUrl: { type: String, default: '' },
  mode: { type: String, default: 'cards' }
});

const LinkedinConfig = mongoose.model('LinkedinConfig', linkedinConfigSchema);

// In-memory fallback dataset for when MongoDB server is not running locally
let memoryProjects = [
  {
    _id: 'p_01',
    title: 'Smart Health Monitoring System',
    description: 'IoT-based healthcare platform with real-time vitals tracking and automated anomaly alert dispatcher.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    projectLink: 'https://github.com/Chethiya4/Smart-Health-Monitor'
  },
  {
    _id: 'p_02',
    title: 'E-Commerce Microservices Engine',
    description: 'Scalable distributed e-commerce architecture with payment gateway integration and event logging.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'Redis'],
    projectLink: 'https://github.com/Chethiya4/Ecommerce-Platform'
  },
  {
    _id: 'p_03',
    title: 'AI Weather Analytics Dashboard',
    description: 'Predictive weather forecasting interface integrating OpenWeather API and interactive 3D visualizations.',
    technologies: ['Javascript', 'Three.js', 'CSS3', 'HTML5'],
    projectLink: 'https://github.com/Chethiya4/Weather-Dashboard'
  }
];

let memoryLinkedinPosts = [
  {
    _id: 'ln_real_01',
    authorName: 'Chethiya Samaradiwakara',
    authorTitle: 'Undergraduate at USJ | Vice Chairperson IEEE CS',
    authorAvatar: 'personal_photo.jpg',
    postText: 'Excited for this opportunity to learn, lead, and grow alongside an amazing team. ✨ Strong leadership grows through collaboration. Congratulations to Mr. Chethiya Samaradiwakara on being appointed as the Vice Chairperson of the IEEE Computer Society Student Branch Chapter 2026/27 of the University of Sri Jayewardenepura. Wishing you a successful journey of support, teamwork, and dedication in shaping the future of our community. 🌟 #IEEE #USJ #IEEESB #CS',
    postImage: '',
    postLink: 'https://www.linkedin.com/posts/chethiya-samaradiwakara-11a816322_excited-for-this-opportunity-to-learn-lead-share-7456313010702245888-Iwo6/',
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7456313010702245888',
    likesCount: 21,
    commentsCount: 1,
    timestamp: new Date('2026-07-20T10:00:00Z').toISOString()
  },
  {
    _id: 'ln_real_02',
    authorName: 'Chethiya Samaradiwakara',
    authorTitle: 'Undergraduate at USJ | Vice Chairperson IEEE CS',
    authorAvatar: 'personal_photo.jpg',
    postText: 'Grateful to have been part of IEEE EXCELLENCIA. ✨ It was a great opportunity to join this special event, meet fellow IEEE members, and be part of an inspiring atmosphere. Every experience like this is a reminder of the value of being involved in such an amazing community. Looking forward to creating more memories, building new connections, and taking part in many more IEEE events in the future. 🌐 #IEEE #IEEEXCELLENCIA #USJ #ComputerScience',
    postImage: '',
    postLink: 'https://www.linkedin.com/posts/chethiya-samaradiwakara-11a816322_ieee-ugcPost-7485775607662800896-DtJv/',
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7485775607662800896',
    likesCount: 35,
    commentsCount: 5,
    timestamp: new Date('2026-07-15T10:00:00Z').toISOString()
  },
  {
    _id: 'ln_real_03',
    authorName: 'Chethiya Samaradiwakara',
    authorTitle: 'Undergraduate at USJ | Vice Chairperson IEEE CS',
    authorAvatar: 'personal_photo.jpg',
    postText: 'Glad to be part of the Computer Science Association Board 2026/2027. 💻 Looking ahead with enthusiasm to work with the team, contribute to impactful initiatives, and support our student community. Excited for the journey ahead! 🎓 #CSA #ComputerScience #USJ #Leadership',
    postImage: '',
    postLink: 'https://www.linkedin.com/posts/chethiya-samaradiwakara-11a816322_glad-to-be-part-of-the-computer-science-association-share-7425797608176046080-7PHA/',
    embedUrl: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7425797608176046080',
    likesCount: 42,
    commentsCount: 8,
    timestamp: new Date('2026-07-10T10:00:00Z').toISOString()
  }
];

let memoryLinkedinConfig = {
  widgetScript: '',
  feedUrl: '',
  mode: 'cards'
};

// Seed initial projects and linkedin posts into MongoDB
async function seedInitialProjects() {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      const seedData = memoryProjects.map(p => ({
        title: p.title,
        description: p.description,
        technologies: p.technologies,
        projectLink: p.projectLink
      }));
      await Project.insertMany(seedData);
      console.log('Initial sample projects seeded to MongoDB.');
    }

    // Refresh LinkedIn posts in database with real posts
    await LinkedinPost.deleteMany({});
    const lnSeedData = memoryLinkedinPosts.map(p => ({
      authorName: p.authorName,
      authorTitle: p.authorTitle,
      authorAvatar: p.authorAvatar,
      postText: p.postText,
      postImage: p.postImage,
      postLink: p.postLink,
      embedUrl: p.embedUrl,
      likesCount: p.likesCount,
      commentsCount: p.commentsCount,
      timestamp: p.timestamp
    }));
    await LinkedinPost.insertMany(lnSeedData);
    console.log('Real published LinkedIn posts seeded to MongoDB.');
  } catch (err) {
    console.error('Error seeding initial data:', err);
  }
}

// -------------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mongoConnected: isMongoConnected,
    timestamp: new Date()
  });
});

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    if (isMongoConnected) {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.json(projects);
    }
    res.json(memoryProjects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects: ' + err.message });
  }
});

// POST new project
app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, technologies, projectLink } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required fields.' });
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : (technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : []);

    if (isMongoConnected) {
      const newProject = new Project({
        title,
        description,
        technologies: techArray,
        projectLink: projectLink || '#'
      });
      const savedProject = await newProject.save();
      return res.status(201).json(savedProject);
    }

    // Fallback to memory
    const newProj = {
      _id: 'proj_' + Date.now(),
      title,
      description,
      technologies: techArray,
      projectLink: projectLink || '#'
    };
    memoryProjects.unshift(newProj);
    res.status(201).json(newProj);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project: ' + err.message });
  }
});

// PUT update project by ID
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, technologies, projectLink } = req.body;

    const techArray = Array.isArray(technologies)
      ? technologies
      : (technologies ? technologies.split(',').map(t => t.trim()).filter(Boolean) : []);

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { title, description, technologies: techArray, projectLink },
        { new: true }
      );
      if (!updatedProject) {
        return res.status(404).json({ error: 'Project not found.' });
      }
      return res.json(updatedProject);
    }

    // Fallback to memory
    const index = memoryProjects.findIndex(p => p._id === id);
    if (index !== -1) {
      memoryProjects[index] = {
        ...memoryProjects[index],
        title,
        description,
        technologies: techArray,
        projectLink
      };
      return res.json(memoryProjects[index]);
    }

    res.status(404).json({ error: 'Project not found.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project: ' + err.message });
  }
});

// DELETE project by ID
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await Project.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Project not found.' });
      }
      return res.json({ message: 'Project deleted successfully.', id });
    }

    // Fallback to memory
    const initialLen = memoryProjects.length;
    memoryProjects = memoryProjects.filter(p => p._id !== id);
    if (memoryProjects.length < initialLen) {
      return res.json({ message: 'Project deleted successfully.', id });
    }

    res.status(404).json({ error: 'Project not found.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project: ' + err.message });
  }
});

// -------------------------------------------------------------------
// LINKEDIN POSTS API ROUTES
// -------------------------------------------------------------------

// GET LinkedIn Posts
app.get('/api/linkedin-posts', async (req, res) => {
  try {
    if (isMongoConnected) {
      const posts = await LinkedinPost.find().sort({ timestamp: -1 });
      return res.json(posts);
    }
    res.json(memoryLinkedinPosts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch LinkedIn posts: ' + err.message });
  }
});

// POST new LinkedIn Post
app.post('/api/linkedin-posts', async (req, res) => {
  try {
    const { authorName, authorTitle, authorAvatar, postText, postImage, postLink, likesCount, commentsCount } = req.body;

    if (!postText) {
      return res.status(400).json({ error: 'Post text is required.' });
    }

    const postObj = {
      authorName: authorName || 'Chethiya Samaradiwakara',
      authorTitle: authorTitle || 'Undergraduate at USJ | Vice Chairperson IEEE CS',
      authorAvatar: authorAvatar || 'personal_photo.jpg',
      postText,
      postImage: postImage || '',
      postLink: postLink || 'https://www.linkedin.com/in/chethiya-samaradiwakara-11a816322/',
      likesCount: likesCount ? parseInt(likesCount) : 0,
      commentsCount: commentsCount ? parseInt(commentsCount) : 0,
      timestamp: new Date()
    };

    if (isMongoConnected) {
      const newPost = new LinkedinPost(postObj);
      const savedPost = await newPost.save();
      return res.status(201).json(savedPost);
    }

    // Fallback memory
    const newMemPost = {
      _id: 'ln_' + Date.now(),
      ...postObj
    };
    memoryLinkedinPosts.unshift(newMemPost);
    res.status(201).json(newMemPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create LinkedIn post: ' + err.message });
  }
});

// PUT update LinkedIn Post by ID
app.put('/api/linkedin-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { authorName, authorTitle, authorAvatar, postText, postImage, postLink, likesCount, commentsCount } = req.body;

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const updatedPost = await LinkedinPost.findByIdAndUpdate(
        id,
        { authorName, authorTitle, authorAvatar, postText, postImage, postLink, likesCount, commentsCount },
        { new: true }
      );
      if (!updatedPost) return res.status(404).json({ error: 'Post not found.' });
      return res.json(updatedPost);
    }

    const index = memoryLinkedinPosts.findIndex(p => p._id === id);
    if (index !== -1) {
      memoryLinkedinPosts[index] = {
        ...memoryLinkedinPosts[index],
        authorName: authorName || memoryLinkedinPosts[index].authorName,
        authorTitle: authorTitle || memoryLinkedinPosts[index].authorTitle,
        authorAvatar: authorAvatar || memoryLinkedinPosts[index].authorAvatar,
        postText: postText || memoryLinkedinPosts[index].postText,
        postImage: postImage !== undefined ? postImage : memoryLinkedinPosts[index].postImage,
        postLink: postLink || memoryLinkedinPosts[index].postLink,
        likesCount: likesCount !== undefined ? likesCount : memoryLinkedinPosts[index].likesCount,
        commentsCount: commentsCount !== undefined ? commentsCount : memoryLinkedinPosts[index].commentsCount
      };
      return res.json(memoryLinkedinPosts[index]);
    }

    res.status(404).json({ error: 'Post not found.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update LinkedIn post: ' + err.message });
  }
});

// DELETE LinkedIn Post by ID
app.delete('/api/linkedin-posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await LinkedinPost.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Post not found.' });
      return res.json({ message: 'LinkedIn post deleted successfully.', id });
    }

    const initialLen = memoryLinkedinPosts.length;
    memoryLinkedinPosts = memoryLinkedinPosts.filter(p => p._id !== id);
    if (memoryLinkedinPosts.length < initialLen) {
      return res.json({ message: 'LinkedIn post deleted successfully.', id });
    }

    res.status(404).json({ error: 'Post not found.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete LinkedIn post: ' + err.message });
  }
});

// GET / POST LinkedIn Config (Widget Script / Feed mode)
app.get('/api/linkedin-config', async (req, res) => {
  try {
    if (isMongoConnected) {
      let config = await LinkedinConfig.findOne();
      if (!config) {
        config = new LinkedinConfig(memoryLinkedinConfig);
        await config.save();
      }
      return res.json(config);
    }
    res.json(memoryLinkedinConfig);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch config: ' + err.message });
  }
});

app.post('/api/linkedin-config', async (req, res) => {
  try {
    const { widgetScript, feedUrl, mode } = req.body;
    if (isMongoConnected) {
      let config = await LinkedinConfig.findOne();
      if (!config) {
        config = new LinkedinConfig({ widgetScript, feedUrl, mode });
      } else {
        if (widgetScript !== undefined) config.widgetScript = widgetScript;
        if (feedUrl !== undefined) config.feedUrl = feedUrl;
        if (mode !== undefined) config.mode = mode;
      }
      await config.save();
      return res.json(config);
    }

    if (widgetScript !== undefined) memoryLinkedinConfig.widgetScript = widgetScript;
    if (feedUrl !== undefined) memoryLinkedinConfig.feedUrl = feedUrl;
    if (mode !== undefined) memoryLinkedinConfig.mode = mode;
    res.json(memoryLinkedinConfig);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save config: ' + err.message });
  }
});

// Serve frontend SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
