# TeamTask

TeamTask is a lightweight project & task management prototype with a polished, animated landing page (GSAP + custom canvas), a pragmatic Node/Express backend offering JWT authentication (register, login, forgot/reset, resend) and developer-friendly fallbacks that log verification/reset links to `server.log` when SMTP is not configured. Frontend is vanilla HTML/CSS/JS with localStorage-stored preferences; repo includes experimental Vue and Java sample backends.

## ✨ Features

### 🎨 Frontend
- **Animated Landing Page**: Beautiful animations powered by GSAP
- **Custom Canvas Background**: Interactive particle animation
- **Vanilla JavaScript**: No heavy frameworks, pure JS implementation
- **Responsive Design**: Works seamlessly on desktop and mobile
- **LocalStorage**: User preferences persist across sessions
- **Modern UI**: Dark theme with gradient accents

### 🔐 Backend Authentication
- **JWT Authentication**: Secure token-based auth
- **User Registration**: Create new accounts with email verification
- **Login/Logout**: Standard authentication flow
- **Forgot Password**: Password reset functionality
- **Resend Verification**: Re-send verification emails
- **Dev-Friendly**: Verification/reset links logged to `Backend/server.log` when SMTP is not configured

### 📋 Task Management
- **CRUD Operations**: Create, Read, Update, Delete tasks
- **Task Properties**: Title, description, status, priority, due date
- **Status Tracking**: Todo, In Progress, Done
- **Priority Levels**: Low, Medium, High
- **CSV Import/Export**: Bulk import and export tasks

### 📊 Project Management
- **Create Projects**: Organize tasks into projects
- **Color Coding**: Assign custom colors to projects
- **Project Filtering**: View tasks by project
- **Project CRUD**: Full management capabilities

### 🛠️ Developer Features
- **RESTful API**: Clean, documented API endpoints
- **File-based Storage**: Simple JSON file storage (easy to replace with a database)
- **Sample Seed Data**: Pre-populated demo data for testing
- **CORS Enabled**: Easy frontend integration
- **Error Handling**: Comprehensive error responses

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (or copy from `.env.example`):
```bash
cp .env.example .env
```

4. (Optional) Seed the database with sample data:
```bash
node data/seed.js
```

This creates a demo user:
- Email: `demo@teamtask.com`
- Password: `demo123`

5. Start the server:
```bash
npm start
```

Or use nodemon for development:
```bash
npm run dev
```

The backend will start on `http://localhost:3000`

### Frontend Setup

1. Open `Frontend/index.html` in your browser, or serve it with a simple HTTP server:

```bash
cd Frontend
python -m http.server 8080
# or
npx http-server -p 8080
```

2. Access the application at `http://localhost:8080`

## 📁 Project Structure

```
TeamTask/
├── Backend/                 # Node/Express backend
│   ├── data/               # JSON data storage
│   │   ├── database.js     # Database operations
│   │   ├── seed.js         # Sample seed data
│   │   ├── users.json      # User data
│   │   ├── tasks.json      # Task data
│   │   └── projects.json   # Project data
│   ├── middleware/         # Express middleware
│   │   └── auth.js         # JWT authentication
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── tasks.js        # Task routes
│   │   └── projects.js     # Project routes
│   ├── utils/              # Utility functions
│   │   ├── jwt.js          # JWT utilities
│   │   └── logger.js       # Logging utilities
│   ├── .env.example        # Environment variables template
│   ├── package.json        # Dependencies
│   └── server.js           # Main server file
├── Frontend/               # Vanilla JS frontend
│   ├── css/
│   │   └── styles.css      # Styles
│   ├── js/
│   │   ├── animations.js   # GSAP animations
│   │   ├── app.js          # Task/Project management
│   │   ├── auth.js         # Authentication logic
│   │   ├── canvas.js       # Canvas particle animation
│   │   └── main.js         # Main initialization
│   └── index.html          # Main HTML file
├── ExperimentalBackends/   # Sample alternative backends
│   ├── Vue/                # Vue.js sample
│   └── Java/               # Java/Spring Boot sample
└── README.md               # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify/:token` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Tasks (Protected)
- `GET /api/tasks` - Get all tasks for user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/export/csv` - Export tasks to CSV
- `POST /api/tasks/import/csv` - Import tasks from CSV

### Projects (Protected)
- `GET /api/projects` - Get all projects for user
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Health Check
- `GET /api/health` - Check API status

## 🔐 Environment Variables

Create a `.env` file in the Backend directory:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@teamtask.com
```

**Note**: When SMTP settings are not configured, verification and reset links are logged to `Backend/server.log` for development convenience.

## 🎯 Usage

### First Time Setup
1. Start the backend server
2. Open the frontend in your browser
3. Click "Get Started" or "Sign In"
4. Register a new account
5. Check `Backend/server.log` for the verification link
6. Click the verification link (or use the API endpoint directly)
7. Log in with your credentials
8. Start creating tasks and projects!

### Demo Account
If you ran the seed script, you can use:
- Email: `demo@teamtask.com`
- Password: `demo123`

## 🧪 Experimental Backends

The `ExperimentalBackends` directory contains sample implementations in other technologies:

- **Vue**: Vue.js with Vuex and Vue Router
- **Java**: Spring Boot with Spring Security

These are proof-of-concept implementations and not production-ready.

## 🛡️ Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- Passwords are hashed with bcrypt
- CORS is enabled (configure for production)
- File-based storage is simple but not recommended for production
- Environment variables should be properly secured in production

## 📝 License

MIT

## 🤝 Contributing

This is a prototype/learning project. Feel free to fork and experiment!

## 📧 Support

For issues or questions, please check the code comments or create an issue in the repository.
