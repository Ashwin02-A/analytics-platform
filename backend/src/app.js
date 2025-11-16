require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const sequelize = require('./config/db');
const User = require('./models/User');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: process.env.GOOGLE_CALLBACK_URL,
// }, async (token, tokenSecret, profile, done) => {
//   let user = await User.findOne({ where: { googleId: profile.id } });
//   if (!user) user = await User.create({ googleId: profile.id, email: profile.emails[0].value, name: profile.displayName });
//   done(null, user);
// }));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,  // ← Uses .env
}, async (token, tokenSecret, profile, done) => {     
  // ... same
}));

passport.serializeUser((u, done) => done(null, u.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/analytics', passport.authenticate('session'), require('./routes/analytics'));
app.use('/api/analytics', require('./routes/events'));

const specs = swaggerJsdoc({
  definition: { openapi: '3.0.0', info: { title: 'Analytics API', version: '1.0' } },
  apis: ['./src/routes/*.js'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

sequelize.sync().then(() => {
  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend on ${PORT}`));
});