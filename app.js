require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./models');

app.set('view engine', 'ejs');

db.sequelize.authenticate()
  .then(() => console.log('🟢 Banco conectado com sucesso'))
  .catch(err => console.error('🔴 Erro ao conectar no banco:', err));

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});