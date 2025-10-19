const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const db = require('../data/database');

const router = express.Router();

// All routes require authentication
// NOTE: For production, implement rate limiting (e.g., using express-rate-limit)
// to prevent DoS attacks on authenticated endpoints
router.use(authMiddleware);

// Get all projects
router.get('/', (req, res) => {
  try {
    const projects = db.getProjects(req.user.userId);
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create project
router.post('/', (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const project = {
      id: uuidv4(),
      userId: req.user.userId,
      name,
      description: description || '',
      color: color || '#3498db',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.createProject(project);
    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };

    const updatedProject = db.updateProject(id, req.user.userId, updates);
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteProject(id, req.user.userId);

    if (!deleted) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
