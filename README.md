# Talvyn — AI Recruitment Platform

**Talent · Vision · AI**

Talvyn is a full-stack AI-assisted recruitment platform built to bring the main stages of hiring into one place. It provides separate workflows for recruiters and applicants, from creating and applying to jobs to resume analysis, candidate evaluation, interview scheduling, and recruitment analytics.

The project was developed as a **5-member team project**, with different team members contributing to different parts of the application. My work focused mainly on application workflow, backend/API integration, job management, AI integration, candidate workflow, debugging, Git collaboration, and deployment-related issues.

---

## Overview

Recruitment usually involves multiple separate steps — posting jobs, collecting resumes, reviewing candidates, comparing skills, scheduling interviews, and tracking applications.

Talvyn brings these workflows together through two role-based experiences:

* **Recruiters** can create and manage jobs, review applications, analyze candidates, schedule interviews, and view recruitment analytics.
* **Applicants** can browse jobs, apply with their resumes, manage their profiles, track applications, and use AI-assisted features for resume and career feedback.

The goal was not just to build a UI, but to understand how a real full-stack application works when authentication, databases, file storage, third-party APIs, AI processing, and deployment all need to work together.

---

## Key Features

### Recruiter

* Recruiter registration and authentication
* Protected recruiter dashboard
* Create, edit, archive, and manage jobs
* View and manage applications
* Candidate management
* Resume viewing and downloading
* AI-assisted resume analysis
* Candidate/job matching
* AI match score
* Matched and missing skills
* Candidate strengths and weaknesses
* AI recommendation
* Skill-gap analysis
* Candidate search and filtering
* Interview scheduling
* Recruitment analytics

### Applicant

* Applicant registration and authentication
* Protected applicant dashboard
* Browse available jobs
* Search and filter jobs
* View job details
* Apply for jobs
* Resume upload
* Applicant profile management
* Application status tracking
* Candidate Copilot / AI assistance
* AI-assisted resume feedback

---

## AI-Powered Candidate Analysis

One of the main parts of Talvyn is the AI-assisted candidate analysis workflow.

Instead of only storing a candidate's resume, the platform processes the resume and extracts useful information that can be compared with a recruiter's job requirements.

### Analysis Pipeline

```text
Resume Upload
      │
      ▼
File Storage
      │
      ▼
PDF/Text Extraction
      │
      ▼
Resume Information Extraction
      │
      ├── Skills
      ├── Experience
      ├── Education
      └── Projects
      │
      ▼
Compare with Job Description
      │
      ▼
AI Analysis
      │
      ├── Match Score
      ├── Matched Skills
      ├── Missing Skills
      ├── Strengths
      ├── Weaknesses
      ├── Recommendation
      └── Skill Gap
```

The AI output is intended to **assist recruiters**, rather than replace human decision-making. Results can depend on resume quality, job-description clarity, document format, and the AI service being used.

---

## Candidate Workflow

```text
Recruiter creates a job
          ↓
Applicant discovers the job
          ↓
Applicant applies with resume
          ↓
Resume is uploaded
          ↓
Resume text is extracted
          ↓
Candidate information is analyzed
          ↓
AI compares candidate with job requirements
          ↓
Candidate/match information is generated
          ↓
Recruiter reviews candidates
          ↓
Recruiter searches and filters candidates
          ↓
Interview can be scheduled
          ↓
Application status can be updated
```

This workflow connects the **Job → Application → Candidate → Interview** stages instead of treating them as completely separate modules.

---

## System Architecture

```text
                  ┌─────────────────────┐
                  │    React Frontend   │
                  │  MUI + React Query   │
                  └──────────┬──────────┘
                             │
                             │ REST API
                             ▼
                  ┌─────────────────────┐
                  │   Node + Express    │
                  │    Backend API      │
                  └──────┬───────┬──────┘
                         │       │
              ┌──────────┘       └─────────────┐
              ▼                                ▼
     ┌─────────────────┐              ┌─────────────────┐
     │ MongoDB Atlas   │              │   AI Services   │
     │  Application    │              │ Resume Analysis │
     │  Data           │              │   & Matching    │
     └─────────────────┘              └─────────────────┘
                         │
                         ▼
                 ┌─────────────────┐
                 │     AWS S3      │
                 │ Resume / Files  │
                 └─────────────────┘
```

### Main flow

The React frontend communicates with the Express backend through REST APIs. The backend handles authentication, business logic, database operations, file processing, and communication with external AI services.

MongoDB stores application data, while uploaded resume files are handled through cloud storage. AI services are used when resume or candidate analysis is required.

---

## Technology Stack

| Area              | Technologies                                               |
| ----------------- | ---------------------------------------------------------- |
| Frontend          | React, Vite, React Router, Material UI, React Query, Axios |
| State / Context   | React Context API                                          |
| Backend           | Node.js, Express.js                                        |
| Database          | MongoDB, Mongoose, MongoDB Atlas                           |
| Authentication    | JWT                                                        |
| AI                | AI APIs used for resume analysis and candidate matching    |
| Resume Processing | PDF processing, PDF.js, OCR/Tesseract.js where required    |
| File Upload       | Multer                                                     |
| File Storage      | AWS S3                                                     |
| Email             | Nodemailer                                                 |
| Deployment        | Render                                                     |
| Development       | Git, GitHub, VS Code                                       |

> The exact AI provider can vary depending on the configured environment/API. API keys are kept outside the source code using environment variables.

---

## Important Engineering Decisions

### Role-Based Authentication

Talvyn has separate recruiter and applicant workflows. Authentication information is used to protect routes and ensure that users can access functionality relevant to their role.

### Protected API Routes

Backend routes that handle private data are protected using authentication middleware. This prevents unauthenticated users from directly accessing protected recruitment resources.

### Frontend / Backend Separation

The project follows a separate frontend and backend structure.

```text
client/
    React application

server/
    Express REST API
```

This made it easier to develop, test, deploy, and debug the two parts independently.

### Resume Upload and Storage

Resume files are uploaded through the backend and stored using AWS S3. The application stores the required file information so that resumes can later be accessed during candidate review.

### AI Analysis Pipeline

AI analysis is treated as a separate processing step instead of mixing AI logic directly into the frontend. The backend handles the communication with AI services and processes the returned information before sending it to the frontend.

### MongoDB Relationships

Different collections/models represent important recruitment entities such as users, jobs, applications, candidates, and interviews. Their relationships allow the application to follow a candidate through different stages of the recruitment process.

### Environment Variables

Credentials and configuration values such as database URLs, JWT secrets, AI API keys, and AWS credentials are kept in environment variables instead of being committed to GitHub.

---

## Project Structure

The project follows a standard full-stack structure:

```text
AI-Recruitment-Platform/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── api/
│   │   └── ...
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   └── ...
│
├── README.md
└── ...
```

The frontend contains the UI, pages, reusable components, API calls, and application context.

The backend contains the REST API, controllers, database models, authentication middleware, routes, and services such as resume/AI processing.


## Challenges We Faced

Building the project as a team introduced several practical issues that are common in full-stack development.

### Frontend and Backend Deployment

The frontend and backend run as separate services, which introduced issues around API URLs, CORS, authentication, and production environment configuration.

We had to make sure the frontend used the correct production API URL and that the backend accepted requests from the deployed frontend.

### Authentication and Token Handling

Authentication required coordination between frontend and backend. Issues around JWT handling, protected routes, cookies/tokens, and request headers had to be debugged across both sides.

This helped us understand that authentication problems are often not isolated to one file — the complete request flow has to be checked.

### Resume Parsing

Not every PDF behaves like a normal text-based PDF. Some resumes contain scanned pages or image-based content, making normal text extraction insufficient.

We worked with PDF processing and OCR-based approaches to handle cases where text could not be extracted directly.

### AI API Integration

AI responses are external dependencies, so the application needs to handle cases such as unexpected responses, API errors, configuration problems, and changes in the format of returned data.

We kept AI processing on the backend and added error handling around the external API calls.

### AWS S3 File Storage

Resume uploads introduced another layer beyond the application server. We had to handle bucket configuration, object paths, credentials, permissions, and file access correctly.

### Local vs Production Differences

Some functionality worked differently after deployment because the production environment had different environment variables, URLs, filesystem behavior, and service configuration.

Debugging these issues gave us experience with problems that don't always appear during local development.

### Git Collaboration

With five people working on the same project, integrating branches sometimes resulted in merge conflicts.

We used Git branching, merging, rebasing, staging, and conflict resolution to combine changes while keeping the main application functional.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/nehajaiswal-cse/AI-Recruitment-Platform.git

cd AI-Recruitment-Platform
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create the required `.env` files based on the configuration used by your local setup.

Example backend configuration:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

OPENAI_API_KEY=your_api_key
GEMINI_API_KEY=your_api_key
OPENROUTER_API_KEY=your_api_key

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket_name
```

Only configure the AI provider variables that your current implementation uses.

Never commit real API keys, database credentials, or AWS credentials to GitHub.

### 5. Start the Backend

```bash
cd server
npm run dev
```

If the project uses a different start script, use the script defined in `server/package.json`.

### 6. Start the Frontend

```bash
cd client
npm run dev
```

The Vite development server will provide the local frontend URL in the terminal.

---

## Environment Variables

The exact variables may differ depending on the deployment configuration, but the main categories are:

| Variable                | Purpose                              |
| ----------------------- | ------------------------------------ |
| `MONGO_URI`             | MongoDB database connection          |
| `JWT_SECRET`            | JWT signing secret                   |
| `OPENAI_API_KEY`        | OpenAI API access, if configured     |
| `GEMINI_API_KEY`        | Gemini API access, if configured     |
| `OPENROUTER_API_KEY`    | OpenRouter API access, if configured |
| `AWS_ACCESS_KEY_ID`     | AWS authentication                   |
| `AWS_SECRET_ACCESS_KEY` | AWS authentication                   |
| `AWS_REGION`            | AWS region                           |
| `AWS_BUCKET_NAME`       | S3 bucket used for files             |

Frontend configuration may also include a Vite environment variable for the backend API URL, depending on the deployment setup.

---

## API Overview

The backend is organized around REST API routes.

| Module         | Purpose                                                |
| -------------- | ------------------------------------------------------ |
| Authentication | Registration, login, authentication-related operations |
| Jobs           | Create and manage recruitment jobs                     |
| Applications   | Submit and manage job applications                     |
| Candidates     | Candidate records, filtering, and candidate management |
| Interviews     | Interview scheduling and management                    |
| Analytics      | Recruitment statistics and analytics                   |
| Resume         | Resume upload and processing                           |
| AI Analysis    | Resume analysis and candidate/job matching             |
| Notifications  | Recruitment/application notifications                  |

The API structure keeps business logic on the backend while the React frontend communicates with it through HTTP requests.

---

## Screenshots

Screenshots can be added here once they are committed to the repository.

Example:

```text
screenshots/
├── recruiter-dashboard.png
├── applicant-dashboard.png
├── candidate-analysis.png
└── job-management.png
```

Then reference them using:

```markdown
![Recruiter Dashboard](./screenshots/recruiter-dashboard.png)

![Applicant Dashboard](./screenshots/applicant-dashboard.png)

![Candidate Analysis](./screenshots/candidate-analysis.png)
```

---

## What I Learned

Working on Talvyn gave me experience beyond simply building React components.

Some of the main things I learned were:

* Building a full-stack application with React, Node.js, Express, and MongoDB.
* Designing and consuming REST APIs.
* Implementing authentication and authorization.
* Working with MongoDB and Mongoose relationships.
* Integrating external AI APIs into a real application.
* Handling file uploads and cloud storage with AWS S3.
* Working with resume/PDF processing and OCR.
* Debugging frontend-backend integration issues.
* Deploying applications and debugging production-specific problems.
* Working with environment variables and external service configuration.
* Using Git branches, merges, rebases, and resolving conflicts.
* Coordinating development across a 5-member team.

One of the biggest lessons was that building a feature is only one part of development. **Integrating that feature with the rest of the application and making it work reliably in different environments is equally important.**

---

## Future Improvements

There are several areas that can be improved as the project evolves:

* Better handling of complex and scanned resumes.
* More consistent AI evaluation across different resume formats.
* Improved notification and email workflows.
* More detailed recruiter analytics.
* Candidate recommendation based on job requirements.
* Interview workflow automation.
* More advanced job and candidate search.
* Improved caching and application scalability.
* Better handling of large files and heavy resume-processing workloads.

These are planned improvements and are not presented as current features.

---

## Team

Talvyn was developed as a **5-member team project**.

Each member contributed to different parts of the application, including frontend development, backend development, AI integration, recruitment workflows, UI, debugging, and deployment.

The project also involved collaborative Git workflows for combining and reviewing changes across different branches.

---

## Project Repository

**GitHub:**
https://github.com/nehajaiswal-cse/AI-Recruitment-Platform

---

## License

This project was developed as an educational/team project.

If you plan to reuse or extend the project, please refer to the repository for the applicable project terms.
