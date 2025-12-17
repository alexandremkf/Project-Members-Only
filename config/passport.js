const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../models');

const User = db.User;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'username' },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ where: { username } });

          if (!user) {
            return done(null, false, { message: 'Usuário não encontrado' });
          }

          const match = await bcrypt.compare(password, user.password);

          if (!match) {
            return done(null, false, { message: 'Senha incorreta' });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};