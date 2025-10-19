const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'server.log');

function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${type}] ${message}\n`;
  
  fs.appendFileSync(logFilePath, logEntry);
  console.log(logEntry.trim());
}

function logVerificationLink(email, token) {
  const message = `Email Verification Link (SMTP not configured):\nEmail: ${email}\nVerification Link: http://localhost:3000/verify?token=${token}`;
  log(message, 'EMAIL');
}

function logResetLink(email, token) {
  const message = `Password Reset Link (SMTP not configured):\nEmail: ${email}\nReset Link: http://localhost:3000/reset-password?token=${token}`;
  log(message, 'EMAIL');
}

module.exports = {
  log,
  logVerificationLink,
  logResetLink
};
