// App Module - Task and Project Management
class TaskApp {
    constructor() {
        this.tasks = [];
        this.projects = [];
        this.currentFilter = null;
    }

    async loadTasks() {
        try {
            const response = await fetch(`${API_BASE}/tasks`, {
                headers: auth.getAuthHeaders()
            });
            
            if (!response.ok) throw new Error('Failed to load tasks');
            
            this.tasks = await response.json();
            this.renderTasks();
        } catch (error) {
            console.error('Load tasks error:', error);
        }
    }

    async loadProjects() {
        try {
            const response = await fetch(`${API_BASE}/projects`, {
                headers: auth.getAuthHeaders()
            });
            
            if (!response.ok) throw new Error('Failed to load projects');
            
            this.projects = await response.json();
            this.renderProjects();
        } catch (error) {
            console.error('Load projects error:', error);
        }
    }

    async createTask(taskData) {
        try {
            const response = await fetch(`${API_BASE}/tasks`, {
                method: 'POST',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify(taskData)
            });
            
            if (!response.ok) throw new Error('Failed to create task');
            
            const task = await response.json();
            this.tasks.push(task);
            this.renderTasks();
            return task;
        } catch (error) {
            console.error('Create task error:', error);
            throw error;
        }
    }

    async updateTask(id, updates) {
        try {
            const response = await fetch(`${API_BASE}/tasks/${id}`, {
                method: 'PUT',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify(updates)
            });
            
            if (!response.ok) throw new Error('Failed to update task');
            
            const updatedTask = await response.json();
            const index = this.tasks.findIndex(t => t.id === id);
            if (index !== -1) {
                this.tasks[index] = updatedTask;
                this.renderTasks();
            }
            return updatedTask;
        } catch (error) {
            console.error('Update task error:', error);
            throw error;
        }
    }

    async deleteTask(id) {
        try {
            const response = await fetch(`${API_BASE}/tasks/${id}`, {
                method: 'DELETE',
                headers: auth.getAuthHeaders()
            });
            
            if (!response.ok) throw new Error('Failed to delete task');
            
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.renderTasks();
        } catch (error) {
            console.error('Delete task error:', error);
            throw error;
        }
    }

    async createProject(projectData) {
        try {
            const response = await fetch(`${API_BASE}/projects`, {
                method: 'POST',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify(projectData)
            });
            
            if (!response.ok) throw new Error('Failed to create project');
            
            const project = await response.json();
            this.projects.push(project);
            this.renderProjects();
            return project;
        } catch (error) {
            console.error('Create project error:', error);
            throw error;
        }
    }

    async exportCSV() {
        try {
            const response = await fetch(`${API_BASE}/tasks/export/csv`, {
                headers: auth.getAuthHeaders()
            });
            
            if (!response.ok) throw new Error('Failed to export tasks');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tasks.csv';
            a.click();
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export tasks');
        }
    }

    async importCSV(csvData) {
        try {
            const response = await fetch(`${API_BASE}/tasks/import/csv`, {
                method: 'POST',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify({ csvData })
            });
            
            if (!response.ok) throw new Error('Failed to import tasks');
            
            await this.loadTasks();
            alert('Tasks imported successfully');
        } catch (error) {
            console.error('Import error:', error);
            alert('Failed to import tasks');
        }
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        if (!container) return;

        let tasksToRender = this.tasks;
        
        if (this.currentFilter) {
            tasksToRender = this.tasks.filter(t => t.projectId === this.currentFilter);
        }

        if (tasksToRender.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No tasks found. Create your first task!</p>';
            return;
        }

        container.innerHTML = tasksToRender.map(task => `
            <div class="task-card" data-task-id="${task.id}">
                <div class="task-header">
                    <div>
                        <h3 class="task-title">${task.title}</h3>
                        ${task.description ? `<p style="color: var(--text-muted); margin-top: 0.5rem;">${task.description}</p>` : ''}
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-small" onclick="app.editTask('${task.id}')">Edit</button>
                        <button class="btn btn-small" style="background: var(--danger-color);" onclick="app.deleteTask('${task.id}')">Delete</button>
                    </div>
                </div>
                <div class="task-meta">
                    <span class="status-badge status-${task.status}">${task.status}</span>
                    <span class="priority-${task.priority}">Priority: ${task.priority}</span>
                    ${task.dueDate ? `<span>Due: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                </div>
            </div>
        `).join('');
    }

    renderProjects() {
        const container = document.getElementById('projectsList');
        if (!container) return;

        container.innerHTML = `
            <li onclick="app.filterByProject(null)" style="${!this.currentFilter ? 'background: var(--bg-color);' : ''}">
                All Tasks
            </li>
            ${this.projects.map(project => `
                <li onclick="app.filterByProject('${project.id}')" style="${this.currentFilter === project.id ? 'background: var(--bg-color);' : ''}">
                    <span style="display: inline-block; width: 12px; height: 12px; background: ${project.color}; border-radius: 50%; margin-right: 0.5rem;"></span>
                    ${project.name}
                </li>
            `).join('')}
        `;
    }

    filterByProject(projectId) {
        this.currentFilter = projectId;
        const title = document.getElementById('contentTitle');
        if (projectId) {
            const project = this.projects.find(p => p.id === projectId);
            title.textContent = project ? project.name : 'All Tasks';
        } else {
            title.textContent = 'All Tasks';
        }
        this.renderTasks();
        this.renderProjects();
    }

    showTaskModal(task = null) {
        const modal = document.getElementById('authModal');
        const authContent = document.getElementById('authContent');
        
        const projectOptions = this.projects.map(p => 
            `<option value="${p.id}" ${task && task.projectId === p.id ? 'selected' : ''}>${p.name}</option>`
        ).join('');
        
        authContent.innerHTML = `
            <h2>${task ? 'Edit Task' : 'New Task'}</h2>
            <form id="taskForm">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="taskTitle" value="${task ? task.title : ''}" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="taskDescription" rows="3">${task ? task.description : ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="taskStatus">
                        <option value="todo" ${task && task.status === 'todo' ? 'selected' : ''}>To Do</option>
                        <option value="in-progress" ${task && task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="done" ${task && task.status === 'done' ? 'selected' : ''}>Done</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select id="taskPriority">
                        <option value="low" ${task && task.priority === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${task && task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${task && task.priority === 'high' ? 'selected' : ''}>High</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Project</label>
                    <select id="taskProject">
                        <option value="">No Project</option>
                        ${projectOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Due Date</label>
                    <input type="date" id="taskDueDate" value="${task && task.dueDate ? task.dueDate.split('T')[0] : ''}">
                </div>
                <button type="submit" class="btn btn-primary btn-block">${task ? 'Update' : 'Create'} Task</button>
            </form>
        `;
        
        modal.style.display = 'block';
        
        document.getElementById('taskForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const taskData = {
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('taskDescription').value,
                status: document.getElementById('taskStatus').value,
                priority: document.getElementById('taskPriority').value,
                projectId: document.getElementById('taskProject').value || null,
                dueDate: document.getElementById('taskDueDate').value || null
            };
            
            try {
                if (task) {
                    await this.updateTask(task.id, taskData);
                } else {
                    await this.createTask(taskData);
                }
                closeModal();
            } catch (error) {
                alert('Failed to save task');
            }
        });
    }

    showProjectModal() {
        const modal = document.getElementById('authModal');
        const authContent = document.getElementById('authContent');
        
        authContent.innerHTML = `
            <h2>New Project</h2>
            <form id="projectForm">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="projectName" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="projectDescription" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Color</label>
                    <input type="color" id="projectColor" value="#3498db">
                </div>
                <button type="submit" class="btn btn-primary btn-block">Create Project</button>
            </form>
        `;
        
        modal.style.display = 'block';
        
        document.getElementById('projectForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const projectData = {
                name: document.getElementById('projectName').value,
                description: document.getElementById('projectDescription').value,
                color: document.getElementById('projectColor').value
            };
            
            try {
                await this.createProject(projectData);
                closeModal();
            } catch (error) {
                alert('Failed to create project');
            }
        });
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.showTaskModal(task);
        }
    }
}

// Initialize app instance
const app = new TaskApp();
