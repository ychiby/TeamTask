const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname);
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Initialize data files if they don't exist
function initializeDatabase() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2));
  }
}

// User operations
function getUsers() {
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function findUserByEmail(email) {
  const users = getUsers();
  return users.find(u => u.email === email);
}

function findUserById(id) {
  const users = getUsers();
  return users.find(u => u.id === id);
}

function createUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return user;
}

function updateUser(id, updates) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    return users[index];
  }
  return null;
}

// Task operations
function getTasks(userId = null) {
  const data = fs.readFileSync(TASKS_FILE, 'utf8');
  const tasks = JSON.parse(data);
  return userId ? tasks.filter(t => t.userId === userId) : tasks;
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

function createTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

function updateTask(id, userId, updates) {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id && t.userId === userId);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    saveTasks(tasks);
    return tasks[index];
  }
  return null;
}

function deleteTask(id, userId) {
  const tasks = getTasks();
  const filtered = tasks.filter(t => !(t.id === id && t.userId === userId));
  if (filtered.length < tasks.length) {
    saveTasks(filtered);
    return true;
  }
  return false;
}

// Project operations
function getProjects(userId = null) {
  const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
  const projects = JSON.parse(data);
  return userId ? projects.filter(p => p.userId === userId) : projects;
}

function saveProjects(projects) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

function createProject(project) {
  const projects = getProjects();
  projects.push(project);
  saveProjects(projects);
  return project;
}

function updateProject(id, userId, updates) {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id && p.userId === userId);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates };
    saveProjects(projects);
    return projects[index];
  }
  return null;
}

function deleteProject(id, userId) {
  const projects = getProjects();
  const filtered = projects.filter(p => !(p.id === id && p.userId === userId));
  if (filtered.length < projects.length) {
    saveProjects(filtered);
    return true;
  }
  return false;
}

// Initialize on load
initializeDatabase();

module.exports = {
  // User operations
  getUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  // Task operations
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  // Project operations
  getProjects,
  createProject,
  updateProject,
  deleteProject
};
