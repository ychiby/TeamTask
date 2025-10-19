const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

async function seedData() {
  const usersFile = path.join(__dirname, 'users.json');
  const tasksFile = path.join(__dirname, 'tasks.json');
  const projectsFile = path.join(__dirname, 'projects.json');

  // Sample user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = {
    id: uuidv4(),
    email: 'demo@teamtask.com',
    password: hashedPassword,
    name: 'Demo User',
    verified: true,
    createdAt: new Date().toISOString()
  };

  // Sample projects
  const project1 = {
    id: uuidv4(),
    userId: demoUser.id,
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    color: '#3498db',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const project2 = {
    id: uuidv4(),
    userId: demoUser.id,
    name: 'Mobile App',
    description: 'New mobile application development',
    color: '#e74c3c',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Sample tasks
  const tasks = [
    {
      id: uuidv4(),
      userId: demoUser.id,
      title: 'Design landing page mockup',
      description: 'Create initial design concepts for new landing page',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      projectId: project1.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      userId: demoUser.id,
      title: 'Setup development environment',
      description: 'Install and configure all necessary tools',
      status: 'done',
      priority: 'high',
      dueDate: null,
      projectId: project2.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      userId: demoUser.id,
      title: 'Write API documentation',
      description: 'Document all API endpoints and authentication',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      projectId: project1.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      userId: demoUser.id,
      title: 'Review code submissions',
      description: 'Review and provide feedback on pending PRs',
      status: 'todo',
      priority: 'low',
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      projectId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Write data
  fs.writeFileSync(usersFile, JSON.stringify([demoUser], null, 2));
  fs.writeFileSync(projectsFile, JSON.stringify([project1, project2], null, 2));
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));

  console.log('Seed data created successfully!');
  console.log('Demo user credentials:');
  console.log('  Email: demo@teamtask.com');
  console.log('  Password: demo123');
}

if (require.main === module) {
  seedData().catch(console.error);
}

module.exports = seedData;
