const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// In-memory user store (for demo purposes)
const users = [];
let idCounter = 1;

// Unified login/signup
router.post('/authenticate', (req, res, next) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (user) {
        // User exists, treat as login
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(400).json({
                    message: info ? info.message : 'Login failed',
                    user: user
                });
            }
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const isFirstLogin = user.isFirstLogin;
            if (user.isFirstLogin) {
                user.isFirstLogin = false;
            }
            return res.json({ token, isFirstLogin });
        })(req, res, next);
    } else {
        // User does not exist, treat as signup
        const newUser = { id: idCounter++, email, password, isFirstLogin: true };
        users.push(newUser);
        
        // Log in the new user
        req.login(newUser, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const isFirstLogin = newUser.isFirstLogin;
            if (newUser.isFirstLogin) {
                newUser.isFirstLogin = false;
            }
            return res.status(201).json({ token, isFirstLogin });
        });
    }
});

// Signup
router.post('/signup', (req, res) => {
    const { email, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists.' });
    }
    const newUser = { id: idCounter++, email, password, isFirstLogin: true };
    users.push(newUser);
    res.status(201).json({ message: 'User created successfully.' });
});

// Login
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const isFirstLogin = req.user.isFirstLogin;
    if (req.user.isFirstLogin) {
        req.user.isFirstLogin = false;
    }
    res.json({ token, isFirstLogin });
});

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const isFirstLogin = req.user.isFirstLogin;
    if (req.user.isFirstLogin) {
        req.user.isFirstLogin = false;
    }
    // Redirect to frontend with token
    res.redirect(`http://localhost:4200/dashboard?token=${token}&isFirstLogin=${isFirstLogin}`);
});

module.exports = router;
