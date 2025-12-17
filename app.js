require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./models');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/', authRouter);

// Database
db.sequelize.sync();

// Server
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});