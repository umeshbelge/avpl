import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

// In-memory user store (for demo purposes)
const users = [];
let idCounter = 1;

const configurePassport = (passport) => {
  // JWT Strategy
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(jwtOptions, (jwtPayload, done) => {
      const user = users.find((u) => u.id === jwtPayload.id);
      return user ? done(null, user) : done(null, false);
    })
  );

  // Local Strategy
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      const user = users.find((u) => u.email === email);
      if (!user || user.password !== password) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      return done(null, user);
    })
  );

  // Google OAuth2 Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      (accessToken, refreshToken, profile, done) => {
        let user = users.find((u) => u.googleId === profile.id);

        if (user) {
          return done(null, user);
        }

        const newUser = {
          id: idCounter++,
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value || '',
          picture: profile.photos?.[0]?.value || '',
          isFirstLogin: true,
        };

        users.push(newUser);
        return done(null, newUser);
      }
    )
  );

  // Serialize & Deserialize
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    const user = users.find((u) => u.id === id);
    done(null, user);
  });
};

export default configurePassport;
