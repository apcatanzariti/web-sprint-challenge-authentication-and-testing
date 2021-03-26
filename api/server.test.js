const server = require('./server');
const db = require('./../data/dbConfig');
const request = require('supertest');

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('users').truncate();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe('tests for /api/auth', () => {

  describe('[POST] /api/auth/register', () => {

    it('creates a new entry in the database', async () => {
      await request(server)
      .post('/api/auth/register')
      .send({ username: 'anthony', password: '1234' });

      const users = await db('users');

      expect(users).toHaveLength(4);
    });

    it('responds with the new user', async () => {
      const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'test', password: '1234' });

      expect(res.body.id).toEqual(4);
      expect(res.body.username).toEqual('test');
    });

    it('responds correctly if the username is taken', async () => {
      const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'frodo', password: '1234' });

      expect(res.body.message).toBe('username taken');
    });
  });

  describe('[POST] /api/auth/login', () => {

    it('responds with the correct message', async () => {
      const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'frodo', password: '1234' });
      
      expect(res.body.message).toBe('welcome, frodo');
    });

    it('responds correctly if username is left out', async () => {
      const res = await request(server)
      .post('/api/auth/login')
      .send({ username: '', password: '1234' });

      expect(res.body.message).toBe('username and password required');
    });

    it('responds correctly if password is incorrect', async () => {
      const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'frodo', password: '12345' });

      expect(res.body.message).toBe('invalid credentials');
    });
  });
});

describe('tests for api/jokes', () => {

  describe('[GET] /api/jokes', () => {

    it('gets the correct error if jokes are accessed without token', async () => {
      const res = await request(server)
      .get('/api/jokes');

      expect(res.body.message).toBe('token required');
    });

    it('gets correct status when failing to get jokes', async () => {
      const res = await request(server)
      .get('/api/jokes');

      expect(res.status).toBe(401);
    });
  });
});