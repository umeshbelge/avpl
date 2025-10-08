import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// In-memory user store (for demo purposes)
const users = [];
let idCounter = 1;

// Utility function to generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Unified login/signup
router.post('/authenticate', (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    // Login flow
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : 'Login failed',
          user,
        });
      }

      const token = generateToken(user.id);
      const { isFirstLogin } = user;

      if (user.isFirstLogin) {
        user.isFirstLogin = false;
      }

      return res.json({ token, isFirstLogin });
    })(req, res, next);
  } else {
    // Signup flow
    const newUser = { id: idCounter++, email, password, isFirstLogin: true };
    users.push(newUser);

    req.login(newUser, { session: false }, (err) => {
      if (err) return res.status(500).send(err);

      const token = generateToken(newUser.id);
      const { isFirstLogin } = newUser;

      if (newUser.isFirstLogin) {
        newUser.isFirstLogin = false;
      }

      return res.status(201).json({ token, isFirstLogin });
    });
  }
});

// Signup only
router.post('/signup', (req, res) => {
  const { email, password } = req.body;

  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const newUser = { id: idCounter++, email, password, isFirstLogin: true };
  users.push(newUser);

  return res.status(201).json({ message: 'User created successfully.' });
});

// Login only
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const token = generateToken(req.user.id);
    const { isFirstLogin } = req.user;

    if (req.user.isFirstLogin) {
      req.user.isFirstLogin = false;
    }

    return res.json({ token, isFirstLogin });
  }
);

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user.id);
    const { isFirstLogin } = req.user;

    if (req.user.isFirstLogin) {
      req.user.isFirstLogin = false;
    }

    return res.redirect(
      `http://localhost:4200/dashboard?token=${token}&isFirstLogin=${isFirstLogin}`
    );
  }
);

export default router;
