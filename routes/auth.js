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
router.get('/', (req, res) => {
  res.render('index');
});

// GET signup
router.get('/signup', (req, res) => {
  res.render('signup');
});

// GET login
router.get('/login', (req, res) => {
  res.render('login');
});

// GET join club
router.get('/join', ensureAuthenticated, (req, res) => {
  res.render('join');
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

module.exports = router;