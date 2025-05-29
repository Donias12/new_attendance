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

/**
 * API base URL
 */
const API_BASE_URL = 'https://overjoyed-ash-english.glitch.me/api';

// Check if user is authenticated on pages that require authentication
document.addEventListener('DOMContentLoaded', () => {
  // Skip authentication check for public pages
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
  
  // Check authentication for other pages
  if (!isAuthenticated()) {
    showAlert('Please log in to access this page', 'error');
    window.location.href = 'index.html';
    return;
  }
  
  // Check if on the correct dashboard
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
});