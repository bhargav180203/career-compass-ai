# CareerCompass AI Architecture

## Overview

CareerCompass AI follows a three-tier architecture consisting of:

- Frontend (React.js)
- Backend (Node.js + Express.js)
- Database (MongoDB)

The frontend communicates with the backend using REST APIs. The backend handles business logic, authentication, AI integration, and database operations.

---

## High-Level Architecture

```
React Frontend
       │
       │ REST API
       ▼
Express Backend
       │
 ┌─────┼─────────────┐
 │     │             │
 ▼     ▼             ▼
MongoDB Gemini AI  Adzuna API
```

---

## Frontend

Responsible for:

- User Interface
- Authentication
- Resume Builder
- Career Assessment
- Job Search
- Learning Path
- Dashboard

---

## Backend

Responsible for:

- REST APIs
- JWT Authentication
- Google OAuth
- Business Logic
- AI Requests
- Database Operations

---

## Database

MongoDB stores:

- Users
- Profiles
- Resumes
- Assessments
- Saved Jobs
- Learning Paths

---

## External Services

### Google Gemini

Used for:

- Career Recommendations
- Resume Enhancement
- AI Career Chat
- Learning Roadmaps

### Adzuna API

Used for:

- Live Job Search
- Job Details
- Salary Information