# TeamTask

Prototype task/project management app created during development exercises.

Contents:
- `Backend/` - Node.js API and static server
- `BackendJava/` - Spring Boot backend prototype
- `Frontend/` - static frontend (HTML/CSS/JS)
- `FrontendVue/` - Vue 3 SPA frontend

Features:
- Projects listing and simple CRUD prototype
- Animated home page and Vue SPA
- Authentication endpoints (JWT) in Node backend

How to run (quick):
1. Start Node backend:
   ```powershell
   cd Backend
   npm install
   npm start
   ```
2. Start Vue dev server (optional for SPA):
   ```powershell
   cd FrontendVue
   npm install
   npm run dev -- --host
   ```

License: MIT-style (prototype)
# TeamTask

Prototype project: TeamTask is a lightweight project tracking demo including:

- Node backend (Express) serving API and static frontend (Backend/)
- Java backend (Spring Boot) prototype (BackendJava/)
- Plain static frontend (Frontend/Public)
- Vue 3 SPA frontend (FrontendVue)

Features implemented in this workspace:
- Animated home page (static and Vue)
- Projects CRUD (in-memory for prototype)
- User authentication (Node backend) with JWT
- Animated popup login (Vue)

How to run (quick):

1. Start the Node backend (serves static site + API):
```powershell
cd Backend
npm install
npm start
```

2. (Optional) Run the Vue dev server for the SPA:
```powershell
cd FrontendVue
npm install
npm run dev -- --host
```

This repository is a demo/prototype and not production-ready. Replace the development JWT secret and use secure cookie storage for production.
TeamTask — Project skeleton

This workspace contains two main directories:

- `BackendJava/` — Spring Boot + MyBatis backend skeleton (uses H2 in-memory DB for development)
- `FrontendVue/` — Vue 3 (Vite) frontend skeleton

Quick start (dev):

This repository contains two parallel implementations for rapid prototyping and planned SSM implementation:

A) Node.js prototype (quick, already working)

1. Start the Node prototype backend (serves static files from `Frontend/Public` and API on port 3000):

```powershell
cd Backend
npm install
npm start
```

2. Open the pages served by the Node prototype:

http://localhost:3000/
http://localhost:3000/projects

The Node prototype exposes the API at `http://localhost:3000/api/projects`.

B) Spring Boot + Vue scaffold (recommended for final SSM-based implementation)

1. Start the Spring Boot backend (uses in-memory H2 DB for dev):

```powershell
cd BackendJava
mvn spring-boot:run
```

2. Start the Vue frontend:

```powershell
cd FrontendVue
npm install
npm run dev
```

Notes:
- Spring backend runs on http://localhost:8080 by default. The Vue app requests `http://localhost:8080/api/projects`.
- If you prefer to continue with the Node prototype, use option A. If you want to implement SSM (Spring + MyBatis), use option B.

Next steps:
- Implement persistent MySQL connection in `BackendJava` and MyBatis mappers.
- Add authentication, tasks, comments endpoints, and frontend views in both prototypes as needed.
