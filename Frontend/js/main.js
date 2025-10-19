// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status
    if (auth.isAuthenticated()) {
        showApp();
    } else {
        showLanding();
    }

    // Setup event listeners
    setupEventListeners();
});

function showLanding() {
    document.getElementById('landing').style.display = 'block';
    document.getElementById('app').style.display = 'none';
}

function showApp() {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    
    // Set user name
    if (auth.user) {
        document.getElementById('userName').textContent = auth.user.name || auth.user.email;
    }
    
    // Load data
    app.loadTasks();
    app.loadProjects();
}

function setupEventListeners() {
    // Landing page buttons
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const heroLoginBtn = document.getElementById('heroLoginBtn');
    const heroRegisterBtn = document.getElementById('heroRegisterBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('login');
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('register');
        });
    }
    
    if (heroLoginBtn) {
        heroLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('login');
        });
    }
    
    if (heroRegisterBtn) {
        heroRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('register');
        });
    }
    
    // App buttons
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.logout();
            window.location.reload();
        });
    }
    
    const newTaskBtn = document.getElementById('newTaskBtn');
    if (newTaskBtn) {
        newTaskBtn.addEventListener('click', () => {
            app.showTaskModal();
        });
    }
    
    const newProjectBtn = document.getElementById('newProjectBtn');
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', () => {
            app.showProjectModal();
        });
    }
    
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            app.exportCSV();
        });
    }
    
    const importBtn = document.getElementById('importBtn');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv';
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    app.importCSV(event.target.result);
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }
    
    // Modal close
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('authModal');
        if (event.target === modal) {
            closeModal();
        }
    });
}

// User preferences (localStorage)
const preferences = {
    theme: localStorage.getItem('theme') || 'dark',
    
    save() {
        localStorage.setItem('theme', this.theme);
    }
};

// Apply theme
document.documentElement.setAttribute('data-theme', preferences.theme);
