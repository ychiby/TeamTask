const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { generateToken } = require('../utils/jwt');
const { logVerificationLink, logResetLink } = require('../utils/logger');
const db = require('../data/database');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification token
    const verificationToken = uuidv4();

    // Create user
    const user = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      verified: false,
      verificationToken,
      createdAt: new Date().toISOString()
    };

    db.createUser(user);

    // Log verification link (dev-friendly fallback)
    logVerificationLink(email, verificationToken);

    res.status(201).json({
      message: 'User registered successfully. Check server.log for verification link.',
      userId: user.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(403).json({ error: 'Please verify your email first' });
    }

    // Generate JWT token
    const token = generateToken({ userId: user.id, email: user.email });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify email
router.get('/verify/:token', (req, res) => {
  try {
    const { token } = req.params;

    // Find user by verification token
    const users = db.getUsers();
    const user = users.find(u => u.verificationToken === token);

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    if (user.verified) {
      return res.json({ message: 'Email already verified' });
    }

    // Update user
    db.updateUser(user.id, {
      verified: true,
      verificationToken: null
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Resend verification
router.post('/resend-verification', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.verified) {
      return res.json({ message: 'Email already verified' });
    }

    // Generate new verification token
    const verificationToken = uuidv4();
    db.updateUser(user.id, { verificationToken });

    // Log verification link
    logVerificationLink(email, verificationToken);

    res.json({ message: 'Verification email sent. Check server.log for the link.' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification' });
  }
});

// Forgot password
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: 'If the email exists, a reset link has been sent. Check server.log.' });
    }

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    db.updateUser(user.id, { resetToken, resetTokenExpiry });

    // Log reset link
    logResetLink(email, resetToken);

    res.json({ message: 'If the email exists, a reset link has been sent. Check server.log.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Find user by reset token
    const users = db.getUsers();
    const user = users.find(u => u.resetToken === token);

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    if (new Date() > new Date(user.resetTokenExpiry)) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    db.updateUser(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;
