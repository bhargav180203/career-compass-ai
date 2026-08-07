# CareerCompass AI Deployment Guide

## Requirements

Before running the project, ensure the following are installed:

- Node.js (v18 or later)
- MongoDB
- Git
- npm

---

# Clone Repository

```bash
git clone https://github.com/bhargav180203/career-compass-ai.git
```

```bash
cd career-compass-ai
```

---

# Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file and configure the required environment variables.

Start the backend server (Production):

```bash
npm start
```

Start the backend server (Development):

```bash
npm run dev
```

---

# Frontend Setup

Open a new terminal.

```bash
cd frontend
npm install
npm start
```

---

# Application

Frontend:

```
http://localhost:3000
```

Backend:

```
http://localhost:5000
```

(Use the backend port configured in your project.)

---

# Environment Variables

Example variables:

- MONGO_URI
- JWT_SECRET
- GEMINI_API_KEY
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- EMAIL_USER
- EMAIL_PASS
- ADZUNA_APP_ID
- ADZUNA_APP_KEY

---

# Technologies

- React.js
- Node.js
- Express.js
- MongoDB
- Google Gemini AI
- JWT Authentication
- Tailwind CSS