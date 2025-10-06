const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

// In-memory user store (for demo purposes)
const users = [];
let idCounter = 1;

module.exports = function(passport) {
    // JWT Strategy
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.JWT_SECRET;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        const user = users.find(u => u.id === jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }));

    // Local Strategy
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        const user = users.find(u => u.email === email);
        if (!user || user.password !== password) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        return done(null, user);
    }));

    // Google Strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID, // Replace with your Google Client ID
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Replace with your Google Client Secret
        callbackURL: '/api/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        let user = users.find(u => u.googleId === profile.id);
        if (user) {
            return done(null, user);
        } else {
            const newUser = {
                id: idCounter++,
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                picture: profile.photos[0].value,
                isFirstLogin: true
            };
            users.push(newUser);
            return done(null, newUser);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        const user = users.find(u => u.id === id);
        done(null, user);
    });
};
