# CareerCompass AI Database Design

## Database

CareerCompass AI uses MongoDB as the primary NoSQL database.

The application uses Mongoose ODM for schema definition and data validation.

---

# Collections

## Users

Stores authentication information.

Fields:

- Name
- Email
- Password (Hashed)
- Google ID
- Email Verified
- Role
- Created At

---

## Profiles

Stores user profile information.

Fields:

- Personal Information
- Education
- Experience
- Skills
- Certifications
- Career Preferences

---

## Assessments

Stores completed career assessments.

Fields:

- User ID
- Answers
- Personality Type
- Career Recommendations
- AI Analysis
- Completed Date

---

## Careers

Stores career library information.

Fields:

- Career Name
- Description
- Required Skills
- Salary Range
- Growth Outlook
- Education Requirements

---

## Resumes

Stores user resumes.

Fields:

- Personal Details
- Summary
- Experience
- Education
- Skills
- Projects
- Certifications
- Template
- ATS Score

---

## Saved Jobs

Stores bookmarked jobs.

Fields:

- User ID
- Job Information
- Match Score
- Application Status
- Notes

---

## Learning Paths

Stores AI-generated learning roadmaps.

Fields:

- User ID
- Target Career
- Phases
- Topics
- Resources
- Progress