# CareerCompass AI API Documentation

## Overview

CareerCompass AI follows a RESTful API architecture where the frontend communicates with the backend using HTTP requests.

---

# Authentication APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/verify-email | Verify OTP |
| POST | /api/auth/forgot-password | Send password reset email |
| POST | /api/auth/reset-password | Reset password |
| GET | /api/auth/google | Google OAuth Login |

---

# Profile APIs

| Method | Endpoint |
|---------|----------|
| GET | /api/profile |
| PUT | /api/profile |

---

# Career APIs

| Method | Endpoint |
|---------|----------|
| GET | /api/careers |
| GET | /api/careers/:id |
| POST | /api/careers/ask-ai |

---

# Assessment APIs

| Method | Endpoint |
|---------|----------|
| GET | /api/assessment/questions |
| POST | /api/assessment/submit |

---

# Resume APIs

| Method | Endpoint |
|---------|----------|
| GET | /api/resumes |
| POST | /api/resumes |
| PUT | /api/resumes/:id |
| DELETE | /api/resumes/:id |
| POST | /api/resumes/:id/enhance |

---

# Job APIs

| Method | Endpoint |
|---------|----------|
| GET | /api/jobs/search |
| POST | /api/jobs/save |
| GET | /api/jobs/saved |
| PUT | /api/jobs/status |

---

# Learning Path APIs

| Method | Endpoint |
|---------|----------|
| POST | /api/learning-path/generate |
| GET | /api/learning-path |
| PUT | /api/learning-path/progress |

---

# Response Format

Example Success Response

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

Example Error Response

```json
{
  "success": false,
  "message": "Something went wrong"
}
```