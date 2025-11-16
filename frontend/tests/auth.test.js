const request = require('supertest');
const app = require('../src/App');

test('register requires login', async () => {
  const res = await request(app).post('/api/auth/register');
  expect(res.status).toBe(401);
});