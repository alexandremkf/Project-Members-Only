require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./models');

app.set('view engine', 'ejs');

db.sequelize.sync()
  .then(() => console.log('🟢 Tabelas sincronizadas'))
  .catch(err => console.error(err));

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});