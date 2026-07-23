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

// Mongoose Schema & Model
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: [String], required: true },
  projectLink: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);

// In-memory fallback dataset for when MongoDB server is not running locally
let memoryProjects = [
  {
    _id: 'proj_01',
    title: 'Student Record Manager',
    description: 'A comprehensive Java & Object-Oriented system built for academic record management and course analytics.',
    technologies: ['JAVA', 'OOP', 'DATA STRUCTURES'],
    projectLink: 'https://github.com/Chethiya4/Student--record-manager.git'
  },
  {
    _id: 'proj_02',
    title: 'Task Manager App',
    description: 'A full-stack productivity tool for tracking tasks, deadlines, and project milestones.',
    technologies: ['EXPRESS', 'MONGODB', 'MONGOOSE'],
    projectLink: 'https://github.com/Chethiya4/Task-Manager'
  },
  {
    _id: 'proj_03',
    title: 'Weather Dashboard Node',
    description: 'A real-time weather metrics dashboard fetching live meteorological data from public APIs.',
    technologies: ['JAVASCRIPT', 'API', 'CSS'],
    projectLink: 'https://github.com/Chethiya4/Weather-Dashboard'
  }
];

// Seed initial projects into MongoDB if collection is empty
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
  } catch (err) {
    console.error('Error seeding initial projects:', err);
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

// Serve frontend SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
