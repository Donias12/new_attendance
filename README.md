# Smart Attendance System

A fully functional web-based attendance tracking application for educational institutions.

## Features

- Separate authentication systems for students and lecturers
- Module creation with unique invite codes
- Session-based attendance with custom expiration times
- Comprehensive attendance reporting and statistics
- Mobile-responsive interface
- JWT-based authentication and security

## Project Structure

```
new_attendance/
├── backend/
│   ├── config.js             - Configuration settings
│   ├── server.js             - Main Express server
│   ├── middleware/           - Authentication middleware
│   ├── routes/               - API endpoints
│   │   ├── student.js        - Student routes
│   │   ├── lecturer.js       - Lecturer routes
│   │   ├── module.js         - Module routes
│   │   └── attendance.js     - Attendance routes
│   └── utils/                - Helper functions
├── frontend/
│   ├── index.html            - Landing page
│   ├── about.html            - About page
│   ├── student-login.html    - Student login
│   ├── student-register.html - Student registration
│   ├── student-dashboard.html- Student dashboard
│   ├── lecturer-login.html   - Lecturer login
│   ├── lecturer-register.html- Lecturer registration
│   ├── lecturer-dashboard.html- Lecturer dashboard
│   ├── styles.css            - Styles
│   └── scripts.js            - Common JavaScript
└── database/
    └── new_attendance.sql    - Database schema
```

## Setup Instructions

1. **Set up the database**
   - Start MySQL server (via XAMPP)
   - Import the `database/new_attendance.sql` script in phpMyAdmin

2. **Set up the backend**
   - Navigate to the backend directory: `cd backend`
   - Install dependencies: `npm install`
   - Start the server: `npm start`

3. **Serve the frontend**
   - Navigate to the frontend directory: `cd ../frontend`
   - Serve with a static file server: `python -m http.server 8000`

4. **Access the application**
   - Open a web browser and go to: `http://localhost:8000`

## API Endpoints

- **Student Routes**
  - `POST /student/register` - Register a new student
  - `POST /student/login` - Login a student
  - `POST /student/join-module` - Join a module using invite code
  - `GET /student/modules` - Get student's modules

- **Lecturer Routes**
  - `POST /lecturer/register` - Register a new lecturer
  - `POST /lecturer/login` - Login a lecturer
  - `GET /lecturer/modules` - Get lecturer's modules

- **Module Routes**
  - `POST /module/create` - Create a new module
  - `GET /module/list` - Get list of modules
  - `GET /module/:id` - Get module details

- **Attendance Routes**
  - `POST /attendance/session` - Generate a new session code
  - `POST /attendance/sign` - Sign attendance for a session
  - `GET /attendance/report/:module_code` - Get attendance report for a module
  - `GET /attendance/student/:module_code` - Get student's attendance for a module

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Fetch API
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)