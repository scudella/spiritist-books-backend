const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/authentication');
const rateLimiter = require('express-rate-limit');

const {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  showWebId,
  showAndroidId,
} = require('../controllers/authController');

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
  message: { msg: 'IP Rate Limit exceeded, retry in 15 minutes' },
});

router.route('/register').post(apiLimiter, register);
router.route('/login').post(apiLimiter, login);
router.route('/logout').delete(authenticateUser, logout);
router.route('/verify-email').post(verifyEmail);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);
router.route('/show-web-id').get(showWebId);
router.route('/show-android-id').get(showAndroidId);

module.exports = router;
