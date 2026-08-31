# Talvyn - AI Recruitment Platform

Talvyn is an AI-based recruitment platform developed to make the hiring process easier for both recruiters and applicants.

The main idea of this project is to provide one platform where recruiters can create and manage jobs, view applications and candidates, while applicants can search for jobs and apply by uploading their resumes.

The platform also uses AI to analyze resumes and help recruiters understand how suitable a candidate is for a particular job.

## Features

### For Applicants

* Register and login as an applicant
* View available jobs
* Search and explore job details
* Apply for jobs
* Upload resume while applying
* Add cover letter
* View submitted applications
* Track application status
* Manage profile

### For Recruiters

* Register and login as a recruiter
* Recruiter dashboard
* Create new jobs
* Edit and manage jobs
* View applications
* View candidates
* Check candidate resume details
* View AI-based candidate analysis
* Manage candidate status
* Add recruiter notes
* View recruitment-related information

### AI Features

The AI part of Talvyn is mainly used for resume analysis.

When an applicant applies for a job:

1. The applicant uploads a resume.
2. The resume is stored using AWS S3.
3. Resume content is extracted from the PDF.
4. The extracted information is processed using AI.
5. Skills and experience are identified.
6. The resume is compared with the job requirements.
7. AI-based analysis and score are available to help the recruiter evaluate the candidate.

## Tech Stack

### Frontend

* React.js
* Material UI (MUI)
* React Router
* Axios
* React Hooks and Context API

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* Multer

### Database

* MongoDB
* Mongoose

### AI & File Processing

* AI API
* PDF parsing
* Resume analysis

### Cloud Storage

* AWS S3

### Tools

* Git
* GitHub
* VS Code
* Postman
* npm

## Project Structure

```text
AI-Recruitment-Platform
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── hooks
│   │   └── services
│   └── package.json
│
├── Server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── config
│
├── package.json
└── README.md
```

## How the Application Works

### Applicant Flow

```text
Register/Login
      ↓
Applicant Dashboard
      ↓
Browse Jobs
      ↓
View Job Details
      ↓
Apply for Job
      ↓
Upload Resume
      ↓
Application Created
      ↓
AI Resume Analysis
      ↓
Track Application
```

### Recruiter Flow

```text
Register/Login
      ↓
Recruiter Dashboard
      ↓
Create Job
      ↓
Manage Jobs
      ↓
Receive Applications
      ↓
View Candidates
      ↓
Check AI Analysis
      ↓
Update Candidate Status
```

## Database

MongoDB is used as the main database.

Some of the important collections/models used in the project are:

* User
* Job
* Application
* Candidate

The application connects applicants, jobs and recruiters so that the complete recruitment process can be managed from the platform.

## Authentication

JWT is used for authentication.

There are two main roles in the application:

* Applicant
* Recruiter

After login, users are redirected to their respective dashboards according to their role.

## Resume Upload

Applicants can upload their resume while applying for a job.

The resume file is uploaded to AWS S3 and its information is stored in the database along with the application.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/nehajaiswal-cse/AI-Recruitment-Platform.git
cd AI-Recruitment-Platform
```

### 2. Install dependencies

For the server:

```bash
cd Server
npm install
```

For the client:

```bash
cd ../client
npm install
```

### 3. Environment Variables

Create a `.env` file in the server folder and add the required configuration such as:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name

AI_API_KEY=your_ai_api_key
```

Do not upload the `.env` file or any secret keys to GitHub.

### 4. Run the project

Start the backend:

```bash
cd Server
npm run dev
```

Then start the frontend in another terminal:

```bash
cd client
npm run dev
```

## Why I Built This Project

I built Talvyn to understand how a complete recruitment platform works from both the frontend and backend side.

While working on this project, I worked with:

* React and Material UI
* REST APIs
* Authentication and authorization
* MongoDB and Mongoose
* Resume file uploads
* AWS S3
* PDF processing
* AI integration
* Recruiter and applicant dashboards

The project also helped me understand how different modules such as jobs, applications, candidates and users are connected in a real-world application.

## Future Improvements

Some features I would like to add or improve in the future are:

* Better candidate-job matching
* AI-generated interview questions
* Interview scheduling
* Email notifications
* More detailed recruiter analytics
* Candidate ranking
* Real-time notifications
* Better AI-based recommendations

## Project Status

The project is currently under development and new features and improvements are being added.

## GitHub

Repository:

https://github.com/nehajaiswal-cse/AI-Recruitment-Platform

