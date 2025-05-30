/**
 * Show an alert message
 * @param {string} message - The message to display
 * @param {string} type - The type of alert (success or error)
 */
function showAlert(message, type) {
  // Remove any existing alerts
  const existingAlerts = document.querySelectorAll('.alert');
  existingAlerts.forEach(alert => alert.remove());
  
  // Create alert element
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  // Add to DOM
  document.body.appendChild(alert);
  
  // Remove after 3 seconds
  setTimeout(() => {
    alert.style.opacity = '0';
    alert.style.transform = 'translateX(100%)';
    
    // Remove from DOM after animation
    setTimeout(() => {
      alert.remove();
    }, 500);
  }, 3000);
}

/**
 * Check if user is authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
function isAuthenticated() {
  return !!sessionStorage.getItem('token');
}

/**
 * Get user type (student or lecturer)
 * @returns {string|null} - The user type or null if not authenticated
 */
function getUserType() {
  return sessionStorage.getItem('userType');
}

/**
 * Parse JWT token
 * @param {string} token - The JWT token to parse
 * @returns {object} - The decoded payload
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return {};
  }
}

/**
 * Format date to a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} - The formatted date string
 */
function formatDate(date) {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

/**
 * Calculate time remaining from now until a future date
 * @param {Date|string} futureDate - The future date
 * @returns {object} - Object containing days, hours, minutes, seconds
 */
function calculateTimeRemaining(futureDate) {
  const future = new Date(futureDate).getTime();
  const now = new Date().getTime();
  const diff = future - now;
  
  // Return all zeros if the date is in the past
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, total: diff };
}

/**
 * Generate a random string
 * @param {number} length - The length of the string to generate
 * @returns {string} - The random string
 */
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Redirect to appropriate dashboard based on user type
 */
function redirectToDashboard() {
  const userType = getUserType();
  
  if (!userType) {
    window.location.href = 'index.html';
    return;
  }
  
  if (userType === 'student') {
    window.location.href = 'student-dashboard.html';
  } else if (userType === 'lecturer') {
    window.location.href = 'lecturer-dashboard.html';
  }
}

/**
 * Create API request headers with authentication
 * @returns {object} - Headers object with auth token
 */
function createAuthHeaders() {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

/**
 * Check if the path is the current page
 * @param {string} path - The path to check
 * @returns {boolean} - Whether the path matches the current page
 */
function isCurrentPage(path) {
  return window.location.pathname.endsWith(path);
}

// API Base URL
const API_BASE_URL = 'https://overjoyed-ash-english.glitch.me/api';

// Handle Student Login
function handleStudentLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch(`${API_BASE_URL}/auth/student/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userType', 'student');
        showAlert('Login successful', 'success');
        redirectToDashboard();
      } else {
        showAlert(data.message || 'Login failed', 'error');
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      showAlert('An error occurred', 'error');
    });
}

// Handle Student Registration
function handleStudentRegister(event) {
  event.preventDefault();
  const registrationNumber = document.getElementById('registrationNumber').value;
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const moduleInviteCode = document.getElementById('moduleInviteCode').value;

  fetch(`${API_BASE_URL}/auth/student/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ registrationNumber, fullName, email, password, moduleInviteCode })
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userType', 'student');
        showAlert('Registration successful', 'success');
        redirectToDashboard();
      } else {
        showAlert(data.message || 'Registration failed', 'error');
      }
    })
    .catch(error => {
      console.error('Registration error:', error);
      showAlert('An error occurred', 'error');
    });
}

// Handle Lecturer Login
function handleLecturerLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch(`${API_BASE_URL}/auth/lecturer/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userType', 'lecturer');
        showAlert('Login successful', 'success');
        redirectToDashboard();
      } else {
        showAlert(data.message || 'Login failed', 'error');
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      showAlert('An error occurred', 'error');
    });
}

// Handle Lecturer Registration
function handleLecturerRegister(event) {
  event.preventDefault();
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const classYear = document.getElementById('classYear').value;

  fetch(`${API_BASE_URL}/auth/lecturer/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, classYear })
  })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('userType', 'lecturer');
        showAlert('Registration successful', 'success');
        redirectToDashboard();
      } else {
        showAlert(data.message || 'Registration failed', 'error');
      }
    })
    .catch(error => {
      console.error('Registration error:', error);
      showAlert('An error occurred', 'error');
    });
}

// Handle Create Module (Lecturer)
function handleCreateModule(event) {
  event.preventDefault();
  const moduleCode = document.getElementById('moduleCode').value;
  const moduleName = document.getElementById('moduleName').value;

  fetch(`${API_BASE_URL}/modules/create`, {
    method: 'POST',
    headers: createAuthHeaders(),
    body: JSON.stringify({ moduleCode, moduleName })
  })
    .then(response => response.json())
    .then(data => {
      if (data.module) {
        showAlert('Module created successfully', 'success');
        document.getElementById('createModuleModal').style.display = 'none';
        loadLecturerDashboard();
      } else {
        showAlert(data.message || 'Failed to create module', 'error');
      }
    })
    .catch(error => {
      console.error('Create module error:', error);
      showAlert('An error occurred', 'error');
    });
}

// Handle Join Module (Student)
function handleJoinModule(event) {
  event.preventDefault();
  const moduleInviteCode = document.getElementById('moduleInviteCode').value;

  fetch(`${API_BASE_URL}/modules/join`, {
    method: 'POST',
    headers: createAuthHeaders(),
    body: JSON.stringify({ moduleInviteCode })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Joined module successfully') {
        showAlert('Joined module successfully', 'success');
        document.getElementById('joinModuleModal').style.display = 'none';
        loadStudentDashboard();
      } else {
        showAlert(data.message || 'Failed to join module', 'error');
      }
    })
    .catch(error => {
      console.error('Join module error:', error);
      showAlert('An error occurred', 'error');
    });
}

// Handle Generate Session Code (Lecturer)
function handleGenerateSession(event) {
  event.preventDefault();
  const moduleId = document.getElementById('moduleSelect').value;
  const expirationTime = document.getElementById('expirationTime').value;

  fetch(`${API_BASE_URL}/sessions/generate`, {
    method: 'POST',
    headers: createAuthHeaders(),
    body: JSON.stringify({ moduleId, expirationTime })
  })
    .then(response => response.json())
    .then(data => {
      if (data.session) {
        showAlert('Session code generated', 'success');
        document.getElementById('generateSessionModal').style.display = 'none';
        loadLecturerDashboard();
      } else {
        showAlert(data.message || 'Failed to generate session', 'error');
      }
    })
    .catch(error => {
      console.error('Generate session error:', error);
      showAlert('An error occurred', 'error');
    });
}

// Handle Sign Attendance (Student)
function handleSignAttendance(event) {
  event.preventDefault();
  const sessionCode = document.getElementById('sessionCode').value;

  fetch(`${API_BASE_URL}/sessions/sign`, {
    method: 'POST',
    headers: createAuthHeaders(),
    body: JSON.stringify({ sessionCode })
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Attendance recorded') {
        showAlert('Attendance recorded', 'success');
        document.getElementById('signAttendanceModal').style.display = 'none';
        loadStudentDashboard();
      } else {
        showAlert(data.message || 'Failed to sign attendance', 'error');
      }
    })
    .catch(error => {
      console.error('Sign attendance error:', error);
      showAlert('An error occurred', 'error');
    });
}

// Load Lecturer Dashboard
function loadLecturerDashboard() {
  // Fetch Modules
  fetch(`${API_BASE_URL}/modules`, {
    headers: createAuthHeaders()
  })
    .then(response => response.json())
    .then(modules => {
      const modulesGrid = document.querySelector('.modules-grid');
      const moduleCount = document.querySelector('.stat-card:nth-child(1) .stat-value');
      modulesGrid.innerHTML = '';
      moduleCount.textContent = modules.length;

      if (modules.length === 0) {
        modulesGrid.innerHTML = `
          <div class="empty-state">
            <p>You haven't created any modules yet.</p>
            <a href="#" class="btn btn-primary" onclick="openCreateModuleModal()">Create a Module</a>
          </div>
        `;
      } else {
        modules.forEach(module => {
          const moduleCard = document.createElement('div');
          moduleCard.className = 'module-card';
          moduleCard.innerHTML = `
            <div class="module-card-header">
              <h3>${module.moduleName}</h3>
              <span class="module-code">${module.moduleCode}</span>
            </div>
            <div class="module-card-body">
              <p>Invite Code: ${module.inviteCode}</p>
              <div class="module-card-actions">
                <button class="btn btn-primary" onclick="viewModuleDetails(${module.id})">View Details</button>
              </div>
            </div>
          `;
          modulesGrid.appendChild(moduleCard);
        });
      }

      // Update Module Select in Generate Session Modal
      const moduleSelect = document.getElementById('moduleSelect');
      moduleSelect.innerHTML = '<option value="">-- Select a module --</option>';
      modules.forEach(module => {
        const option = document.createElement('option');
        option.value = module.id;
        option.textContent = `${module.moduleName} (${module.moduleCode})`;
        moduleSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Fetch modules error:', error);
      showAlert('Failed to load modules', 'error');
    });

  // Fetch Active Sessions
  fetch(`${API_BASE_URL}/sessions`, {
    headers: createAuthHeaders()
  })
    .then(response => response.json())
    .then(sessions => {
      const activeSessionCard = document.querySelector('.active-session-card');
      const sessionCount = document.querySelector('.stat-card:nth-child(3) .stat-value');
      activeSessionCard.innerHTML = '';
      sessionCount.textContent = sessions.length;

      if (sessions.length === 0) {
        activeSessionCard.innerHTML = `
          <div class="empty-state">
            <p>No active sessions found.</p>
          </div>
        `;
      } else {
        sessions.forEach(session => {
          const timeRemaining = calculateTimeRemaining(session.expiresAt);
          const sessionCard = document.createElement('div');
          sessionCard.className = 'session-card';
          sessionCard.innerHTML = `
            <div class="session-header">
              <h3>Session</h3>
              <span class="session-status active">Active</span>
            </div>
            <div class="session-body">
              <div class="session-code-display">
                <h4>Session Code</h4>
                <div class="code">${session.sessionCode}</div>
              </div>
              <div class="session-info">
                <p><strong>Module ID:</strong> ${session.moduleId}</p>
                <p><strong>Expires:</strong> ${formatDate(session.expiresAt)}</p>
                <p><strong>Time Remaining:</strong> ${timeRemaining.minutes}m ${timeRemaining.seconds}s</p>
              </div>
            </div>
          `;
          activeSessionCard.appendChild(sessionCard);
        });
      }
    })
    .catch(error => {
      console.error('Fetch sessions error:', error);
      showAlert('Failed to load sessions', 'error');
    });

  // Fetch Total Students
  fetch(`${API_BASE_URL}/attendance`, {
    headers: createAuthHeaders()
  })
    .then(response => response.json())
    .then(attendance => {
      const studentCount = document.querySelector('.stat-card:nth-child(2) .stat-value');
      const uniqueStudents = new Set(attendance.map(record => record.studentId));
      studentCount.textContent = uniqueStudents.size;
    })
    .catch(error => {
      console.error('Fetch attendance error:', error);
      showAlert('Failed to load attendance', 'error');
    });
}

// Load Student Dashboard
function loadStudentDashboard() {
  // Fetch Modules
  fetch(`${API_BASE_URL}/modules`, {
    headers: createAuthHeaders()
  })
    .then(response => response.json())
    .then(modules => {
      const modulesGrid = document.querySelector('.modules-grid');
      const moduleCount = document.querySelector('.stat-card:nth-child(1) .stat-value');
      modulesGrid.innerHTML = '';
      moduleCount.textContent = modules.length;

      if (modules.length === 0) {
        modulesGrid.innerHTML = `
          <div class="empty-state">
            <p>You haven't joined any modules yet.</p>
            <a href="#" class="btn btn-primary" onclick="openJoinModuleModal()">Join a Module</a>
          </div>
        `;
      } else {
        modules.forEach(module => {
          const moduleCard = document.createElement('div');
          moduleCard.className = 'module-card';
          moduleCard.innerHTML = `
            <div class="module-card-header">
              <h3>${module.moduleName}</h3>
              <span class="module-code">${module.moduleCode}</span>
            </div>
            <div class="module-card-body">
              <p>Invite Code: ${module.inviteCode}</p>
              <div class="module-card-actions">
                <button class="btn btn-primary" onclick="viewModuleDetails(${module.id})">View Details</button>
              </div>
            </div>
          `;
          modulesGrid.appendChild(moduleCard);
        });
      }
    })
    .catch(error => {
      console.error('Fetch modules error:', error);
      showAlert('Failed to load modules', 'error');
    });

  // Fetch Attendance
  fetch(`${API_BASE_URL}/attendance`, {
    headers: createAuthHeaders()
  })
    .then(response => response.json())
    .then(attendance => {
      const attendanceList = document.querySelector('.attendance-list');
      const attendanceRate = document.querySelector('.stat-card:nth-child(2) .stat-value');
      const sessionsAttended = document.querySelector('.stat-card:nth-child(3) .stat-value');
      attendanceList.innerHTML = `
        <div class="attendance-header">
          <div class="attendance-cell">Module</div>
          <div class="attendance-cell">Date</div>
          <div class="attendance-cell">Status</div>
          <div class="attendance-cell">Rate</div>
        </div>
      `;

      if (attendance.length === 0) {
        attendanceList.innerHTML += `
          <div class="empty-state">
            <p>No attendance records found.</p>
          </div>
        `;
        attendanceRate.textContent = '0%';
        sessionsAttended.textContent = '0';
      } else {
        attendance.forEach(record => {
          const row = document.createElement('div');
          row.className = 'attendance-row';
          row.innerHTML = `
            <div class="attendance-cell">${record.moduleId}</div>
            <div class="attendance-cell">${formatDate(record.date)}</div>
            <div class="attendance-cell">
              <span class="attendance-status present">${record.status}</span>
            </div>
            <div class="attendance-cell">
              <span class="attendance-rate attendance-high">100%</span>
            </div>
          `;
          attendanceList.appendChild(row);
        });
        attendanceRate.textContent = '100%'; // Simplified for demo
        sessionsAttended.textContent = attendance.length;
      }
    })
    .catch(error => {
      console.error('Fetch attendance error:', error);
      showAlert('Failed to load attendance', 'error');
    });
}

// View Module Details
function viewModuleDetails(moduleId) {
  fetch(`${API_BASE_URL}/modules/${moduleId}`, {
    headers: createAuthHeaders()
  })
    .then(response => response.json())
    .then(module => {
      const modal = document.getElementById('moduleDetailsModal');
      const modalContent = modal.querySelector('.modal-body');
      modalContent.innerHTML = `
        <div class="module-details">
          <div class="module-info">
            <h3>${module.moduleName}</h3>
            <p><strong>Module Code:</strong> ${module.moduleCode}</p>
            <p><strong>Invite Code:</strong> ${module.inviteCode}</p>
          </div>
        </div>
      `;
      modal.style.display = 'block';

      // Fetch Attendance for Module
      fetch(`${API_BASE_URL}/attendance?moduleId=${moduleId}`, {
        headers: createAuthHeaders()
      })
        .then(response => response.json())
        .then(attendance => {
          const moduleReport = document.createElement('div');
          moduleReport.className = 'module-report';
          moduleReport.innerHTML = `
            <h3>Attendance Report</h3>
            <div class="report-summary">
              <div class="summary-item">
                <div class="summary-value">${attendance.length}</div>
                <div class="summary-label">Total Records</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${new Set(attendance.map(r => r.studentId)).size}</div>
                <div class="summary-label">Unique Students</div>
              </div>
            </div>
          `;
          modalContent.appendChild(moduleReport);

          const table = document.createElement('table');
          table.className = 'attendance-table';
          table.innerHTML = `
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          `;
          if (attendance.length === 0) {
            table.innerHTML += `
              <tr>
                <td colspan="3" class="no-data">No attendance records found</td>
              </tr>
            `;
          } else {
            attendance.forEach(record => {
              table.innerHTML += `
                <tr>
                  <td>${record.fullName || record.studentId}</td>
                  <td>${formatDate(record.date)}</td>
                  <td><span class="attendance-status present">${record.status}</span></td>
                </tr>
              `;
            });
          }
          moduleReport.appendChild(table);
        })
        .catch(error => {
          console.error('Fetch attendance error:', error);
          showAlert('Failed to load attendance', 'error');
        });
    })
    .catch(error => {
      console.error('Fetch module error:', error);
      showAlert('Failed to load module details', 'error');
    });
}

// Modal Handlers
function openCreateModuleModal() {
  document.getElementById('createModuleModal').style.display = 'block';
}

function openJoinModuleModal() {
  document.getElementById('joinModuleModal').style.display = 'block';
}

function openGenerateSessionModal() {
  document.getElementById('generateSessionModal').style.display = 'block';
}

function openSignAttendanceModal() {
  document.getElementById('signAttendanceModal').style.display = 'block';
}

// Close Modals
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Logout
function handleLogout() {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userType');
  showAlert('Logged out successfully', 'success');
  window.location.href = 'index.html';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Authentication Check
  if (
    isCurrentPage('index.html') || 
    isCurrentPage('about.html') || 
    isCurrentPage('student-login.html') || 
    isCurrentPage('student-register.html') || 
    isCurrentPage('lecturer-login.html') || 
    isCurrentPage('lecturer-register.html')
  ) {
    return;
  }
  
  if (!isAuthenticated()) {
    showAlert('Please log in to access this page', 'error');
    window.location.href = 'index.html';
    return;
  }
  
  if (isCurrentPage('student-dashboard.html') && getUserType() !== 'student') {
    showAlert('Access denied. Please log in as a student.', 'error');
    window.location.href = 'student-login.html';
    return;
  }
  
  if (isCurrentPage('lecturer-dashboard.html') && getUserType() !== 'lecturer') {
    showAlert('Access denied. Please log in as a lecturer.', 'error');
    window.location.href = 'lecturer-login.html';
    return;
  }

  // Form Submissions
  const studentLoginForm = document.querySelector('#student-login-form');
  if (studentLoginForm) {
    studentLoginForm.addEventListener('submit', handleStudentLogin);
  }

  const studentRegisterForm = document.querySelector('#student-register-form');
  if (studentRegisterForm) {
    studentRegisterForm.addEventListener('submit', handleStudentRegister);
  }

  const lecturerLoginForm = document.querySelector('#lecturer-login-form');
  if (lecturerLoginForm) {
    lecturerLoginForm.addEventListener('submit', handleLecturerLogin);
  }

  const lecturerRegisterForm = document.querySelector('#lecturer-register-form');
  if (lecturerRegisterForm) {
    lecturerRegisterForm.addEventListener('submit', handleLecturerRegister);
  }

  const createModuleForm = document.querySelector('#create-module-form');
  if (createModuleForm) {
    createModuleForm.addEventListener('submit', handleCreateModule);
  }

  const joinModuleForm = document.querySelector('#join-module-form');
  if (joinModuleForm) {
    joinModuleForm.addEventListener('submit', handleJoinModule);
  }

  const generateSessionForm = document.querySelector('#generate-session-form');
  if (generateSessionForm) {
    generateSessionForm.addEventListener('submit', handleGenerateSession);
  }

  const signAttendanceForm = document.querySelector('#sign-attendance-form');
  if (signAttendanceForm) {
    signAttendanceForm.addEventListener('submit', handleSignAttendance);
  }

  // Modal Close Buttons
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      modal.style.display = 'none';
    });
  });

  // Navigation Links
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (href === '#create-module') {
        event.preventDefault();
        openCreateModuleModal();
      } else if (href === '#join-module') {
        event.preventDefault();
        openJoinModuleModal();
      } else if (href === '#generate-session') {
        event.preventDefault();
        openGenerateSessionModal();
      } else if (href === '#sign-attendance') {
        event.preventDefault();
        openSignAttendanceModal();
      } else if (href === '#logout') {
        event.preventDefault();
        handleLogout();
      }
    });
  });

  // Load Dashboards
  if (isCurrentPage('lecturer-dashboard.html')) {
    loadLecturerDashboard();
  } else if (isCurrentPage('student-dashboard.html')) {
    loadStudentDashboard();
  }
});