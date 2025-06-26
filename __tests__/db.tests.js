const fs = require('fs');
const path = require('path');
const { readDB, writeDB } = require('../utils/db');

const DB_PATH = path.join(__dirname, '../db.json');

describe('Mock DB - read and write', () => {
  const mockData = {
    users: [{ id: 999, name: 'Teste', email: 'teste@mock.com' }]
  };

  afterEach(() => {
    // Limpa depois do teste
    writeDB({ users: [] });
  });

  it('deve escrever e ler o db corretamente', () => {
    writeDB(mockData);
    const result = readDB();
    expect(result.users.length).toBe(1);
    expect(result.users[0].name).toBe('Teste');
  });
});
