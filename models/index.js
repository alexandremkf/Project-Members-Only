const { Sequelize } = require('sequelize');
const config = require('../config/database').development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Message = require('./message')(sequelize, Sequelize);

// Relacionamentos
db.User.hasMany(db.Message, { onDelete: 'CASCADE' });
db.Message.belongsTo(db.User);

module.exports = db;