require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const handlebars = require('handlebars');
const { DateTime } = require('luxon');
const compression = require('compression');
const helmet = require('helmet');

const router = require('./routes/mainRouter');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

// Connect to mongo
const mongoDB = process.env.MONGO_DB_URI || process.env.DEV_DB_URL;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Sets up view engine
const hbs = exphbs.create({
  extname: '.hbs',
  helpers: {
    timeDifference(dateGiven) {
      const relativeTime = DateTime.local()
        .minus(new Date() - dateGiven)
        .toRelative();
      return relativeTime === 'in 0 seconds' ? 'Just now' : relativeTime;
    },
    timeFormatter(dateGiven) {
      return DateTime.fromJSDate(dateGiven).toLocaleString(
        DateTime.DATETIME_MED
      );
    },
    if_eq(a, b, opts) {
      if (a === b) return opts.fn(this);
      return opts.inverse(this);
    },
    unescapeText(inputData) {
      if (inputData) {
        return new handlebars.SafeString(inputData);
      }
      return '';
    },
  },
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static('public'));

// Session setup
const sessionStore = new MongoStore({
  mongooseConnection: db,
  collection: 'session',
});
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 7000 * 60 * 60 * 24, // 7 days
    },
  })
);
app.use(flash());

// Passport authentication
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

app.use(compression()); // Compress all routes

// Routes
app.use('/', router);

// Error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
});

app.listen(process.env.PORT || 3000);
