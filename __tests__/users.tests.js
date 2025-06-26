const request = require('supertest');
const { app, server } = require('../index');
const { readDB, writeDB } = require('../utils/db');

const resetDB = () => {
  writeDB({
    users: [
      { id: 1, name: 'Leonardo', email: 'leo@example.com' },
      { id: 2, name: 'Sabrina', email: 'sabrina@example.com' }
    ]
  });
};

beforeEach(() => resetDB());
afterAll(done => server.close(done));

describe('API Users', () => {
  test('GET /users - deve retornar todos usuários', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test('GET /users/:id - deve retornar usuário por id', async () => {
    const res = await request(app).get('/users/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Leonardo');
  });

  test('GET /users/:id - usuário não encontrado', async () => {
    const res = await request(app).get('/users/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/não encontrado/i);
  });

  test('POST /users - criar usuário', async () => {
    const newUser = { name: 'Carlos', email: 'carlos@example.com' };
    const res = await request(app).post('/users').send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe(newUser.name);
  });

  test('POST /users - erro se faltar campo', async () => {
    const res = await request(app).post('/users').send({ name: 'Teste' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/obrigatórios/i);
  });

  test('PUT /users/:id - atualizar usuário', async () => {
    const update = { name: 'Leo Atualizado', email: 'leo2@example.com' };
    const res = await request(app).put('/users/1').send(update);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(update.name);
  });

  test('PUT /users/:id - erro usuário não encontrado', async () => {
    const update = { name: 'x', email: 'x@x.com' };
    const res = await request(app).put('/users/999').send(update);
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /users/:id - deletar usuário', async () => {
    const res = await request(app).delete('/users/1');
    expect(res.statusCode).toBe(204);

    // Validar remoção
    const after = await request(app).get('/users');
    expect(after.body.find(u => u.id === 1)).toBeUndefined();
  });

  test('DELETE /users/:id - erro usuário não encontrado', async () => {
    const res = await request(app).delete('/users/999');
    expect(res.statusCode).toBe(404);
  });
});
