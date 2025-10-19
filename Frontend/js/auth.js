// Authentication Module
// NOTE: This is a prototype implementation. For production:
// - Use httpOnly cookies instead of localStorage for JWT tokens to prevent XSS attacks
// - Implement proper CSRF protection
// - Use secure, sameSite cookie attributes
const API_BASE = 'http://localhost:3000/api';

class Auth {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    async register(email, password, name) {
        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            this.token = data.token;
            this.user = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            return data;
        } catch (error) {
            throw error;
        }
    }

    async forgotPassword(email) {
        try {
            const response = await fetch(`${API_BASE}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    async resetPassword(token, newPassword) {
        try {
            const response = await fetch(`${API_BASE}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Reset failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    async resendVerification(email) {
        try {
            const response = await fetch(`${API_BASE}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    isAuthenticated() {
        return !!this.token;
    }

    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }
}

// Modal handling
function showModal(type) {
    const modal = document.getElementById('authModal');
    const authContent = document.getElementById('authContent');
    
    let content = '';
    
    if (type === 'login') {
        content = `
            <h2>Sign In</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="loginEmail" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="loginPassword" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Sign In</button>
                <p style="margin-top: 1rem; text-align: center;">
                    <a href="#" id="showForgotPassword" style="color: var(--primary-color);">Forgot Password?</a>
                </p>
                <p style="margin-top: 0.5rem; text-align: center; color: var(--text-muted);">
                    Don't have an account? <a href="#" id="showRegisterFromLogin" style="color: var(--primary-color);">Sign Up</a>
                </p>
            </form>
        `;
    } else if (type === 'register') {
        content = `
            <h2>Create Account</h2>
            <form id="registerForm">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="registerName" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="registerEmail" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="registerPassword" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Create Account</button>
                <p style="margin-top: 1rem; text-align: center; color: var(--text-muted);">
                    Already have an account? <a href="#" id="showLoginFromRegister" style="color: var(--primary-color);">Sign In</a>
                </p>
            </form>
        `;
    } else if (type === 'forgot') {
        content = `
            <h2>Reset Password</h2>
            <form id="forgotPasswordForm">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="forgotEmail" required>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Send Reset Link</button>
                <p style="margin-top: 1rem; text-align: center;">
                    <a href="#" id="showLoginFromForgot" style="color: var(--primary-color);">Back to Sign In</a>
                </p>
            </form>
        `;
    }
    
    authContent.innerHTML = content;
    modal.style.display = 'block';
    
    // Setup form handlers
    setupAuthFormHandlers();
}

function closeModal() {
    document.getElementById('authModal').style.display = 'none';
}

function setupAuthFormHandlers() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                await auth.login(email, password);
                closeModal();
                window.location.reload();
            } catch (error) {
                alert(error.message);
            }
        });
        
        const showForgot = document.getElementById('showForgotPassword');
        if (showForgot) {
            showForgot.addEventListener('click', (e) => {
                e.preventDefault();
                showModal('forgot');
            });
        }
        
        const showReg = document.getElementById('showRegisterFromLogin');
        if (showReg) {
            showReg.addEventListener('click', (e) => {
                e.preventDefault();
                showModal('register');
            });
        }
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            try {
                const result = await auth.register(email, password, name);
                alert(result.message);
                showModal('login');
            } catch (error) {
                alert(error.message);
            }
        });
        
        const showLog = document.getElementById('showLoginFromRegister');
        if (showLog) {
            showLog.addEventListener('click', (e) => {
                e.preventDefault();
                showModal('login');
            });
        }
    }
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('forgotEmail').value;
            
            try {
                const result = await auth.forgotPassword(email);
                alert(result.message);
                showModal('login');
            } catch (error) {
                alert(error.message);
            }
        });
        
        const showLog = document.getElementById('showLoginFromForgot');
        if (showLog) {
            showLog.addEventListener('click', (e) => {
                e.preventDefault();
                showModal('login');
            });
        }
    }
}

// Initialize auth instance
const auth = new Auth();
