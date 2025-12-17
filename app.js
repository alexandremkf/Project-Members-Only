require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const db = require('./models');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 🔧 Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// 🔧 Inicializa o Passport
app.use(passport.initialize());
app.use(passport.session());

// 🔧 Configura estratégias do Passport
require('./config/passport')(passport);

// Database
db.sequelize.sync();

// Rotas
const authRouter = require('./routes/auth');
app.use('/', authRouter);

// Server
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});