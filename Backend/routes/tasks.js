const express = require('express');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/auth');
const db = require('../data/database');
const csvParser = require('csv-parser');
const { Parser } = require('json2csv');
const fs = require('fs');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all tasks
router.get('/', (req, res) => {
  try {
    const tasks = db.getTasks(req.user.userId);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create task
router.post('/', (req, res) => {
  try {
    const { title, description, status, priority, dueDate, projectId } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = {
      id: uuidv4(),
      userId: req.user.userId,
      title,
      description: description || '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      projectId: projectId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.createTask(task);
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };

    const updatedTask = db.updateTask(id, req.user.userId, updates);
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteTask(id, req.user.userId);

    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Export tasks to CSV
router.get('/export/csv', (req, res) => {
  try {
    const tasks = db.getTasks(req.user.userId);
    
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks to export' });
    }

    const fields = ['id', 'title', 'description', 'status', 'priority', 'dueDate', 'projectId', 'createdAt', 'updatedAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(tasks);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export tasks error:', error);
    res.status(500).json({ error: 'Failed to export tasks' });
  }
});

// Import tasks from CSV
router.post('/import/csv', (req, res) => {
  try {
    const { csvData } = req.body;

    if (!csvData) {
      return res.status(400).json({ error: 'CSV data is required' });
    }

    const tasks = [];
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',');
        const task = {
          id: uuidv4(),
          userId: req.user.userId,
          title: values[headers.indexOf('title')] || 'Untitled',
          description: values[headers.indexOf('description')] || '',
          status: values[headers.indexOf('status')] || 'todo',
          priority: values[headers.indexOf('priority')] || 'medium',
          dueDate: values[headers.indexOf('dueDate')] || null,
          projectId: values[headers.indexOf('projectId')] || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        tasks.push(task);
        db.createTask(task);
      }
    }

    res.json({ message: `Imported ${tasks.length} tasks`, tasks });
  } catch (error) {
    console.error('Import tasks error:', error);
    res.status(500).json({ error: 'Failed to import tasks' });
  }
});

module.exports = router;
