const express = require('express');
const { readDB, writeDB } = require('./utils/db');

const app = express();
app.use(express.json());

// Listar usuários
app.get('/users', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

// Buscar usuário por ID
app.get('/users/:id', (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(user);
});

// Criar usuário
app.post('/users', (req, res) => {
  const db = readDB();
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Nome e email são obrigatórios' });

  const newUser = {
    id: db.users.length ? db.users[db.users.length - 1].id + 1 : 1,
    name,
    email
  };
  db.users.push(newUser);
  writeDB(db);

  res.status(201).json(newUser);
});

// Atualizar usuário
app.put('/users/:id', (req, res) => {
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).json({ error: 'Usuário não encontrado' });

  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Nome e email são obrigatórios' });

  db.users[userIndex] = { id: db.users[userIndex].id, name, email };
  writeDB(db);

  res.json(db.users[userIndex]);
});

// Deletar usuário
app.delete('/users/:id', (req, res) => {
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).json({ error: 'Usuário não encontrado' });

  db.users.splice(userIndex, 1);
  writeDB(db);

  res.status(204).send();
});

// Start server
const server = app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});

module.exports = { app, server };
