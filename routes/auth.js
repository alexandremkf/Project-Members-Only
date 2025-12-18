const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const db = require('../models');

const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// HOME
router.get('/', async (req, res) => {
  const messages = await db.Message.findAll({
    include: db.User,
    order: [['createdAt', 'DESC']],
  });

  res.render('index', { messages });
});

// GET signup
router.get('/signup', (req, res) => {
  res.render('signup');
});

// GET login
router.get('/login', (req, res) => {
  res.render('login');
});

// GET logout
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// GET join club
router.get('/join', ensureAuthenticated, (req, res) => {
  res.render('join');
});

// GET create message
router.get('/messages/new', ensureAuthenticated, (req, res) => {
  res.render('new-message');
});

// POST signup
router.post(
  '/signup',
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('username').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha mínima de 6 caracteres'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords não conferem');
    }
    return true;
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup', { errors: errors.array() });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      await db.User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hashedPassword,
      });

      res.redirect('/');
    } catch (err) {
      res.render('signup', {
        errors: [{ msg: 'Usuário já existe' }],
      });
    }
  }
);

// POST login
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

// POST join club
router.post('/join', ensureAuthenticated, async (req, res) => {
  const SECRET_PASSCODE = 'club123'; // depois colocamos no .env

  if (req.body.passcode !== SECRET_PASSCODE) {
    return res.render('join', {
      error: 'Passcode incorreto',
    });
  }

  try {
    await db.User.update(
      { membershipStatus: true },
      { where: { id: req.user.id } }
    );

    res.redirect('/');
  } catch (err) {
    res.redirect('/join');
  }
});

// POST create message
router.post('/messages/new', ensureAuthenticated, async (req, res) => {
  try {
    await db.Message.create({
      title: req.body.title,
      text: req.body.text,
      UserId: req.user.id,
    });

    res.redirect('/');
  } catch (err) {
    res.redirect('/messages/new');
  }
});

module.exports = router;