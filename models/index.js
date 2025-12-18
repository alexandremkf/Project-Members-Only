const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/database')[env];

let sequelize;

if (config.use_env_variable) {
  // PRODUÇÃO (Render)
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // DESENVOLVIMENTO (local)
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Message = require('./message')(sequelize, Sequelize);

// Relacionamentos
db.User.hasMany(db.Message, { onDelete: 'CASCADE' });
db.Message.belongsTo(db.User);

module.exports = db;