const express = require('express');
const app = express();
const usersRoutes = require('./routes/users');

app.use(express.json());
app.use('/users', usersRoutes);

app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});

module.exports = app; 