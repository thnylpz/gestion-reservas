const request = require('supertest');
const app = require('../src/app');

describe('API Reservas', () => {

  test('GET /health responde UP', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("UP");
  });

  test('POST /reservas crea reserva', async () => {
    const res = await request(app)
      .post('/reservas')
      .send({ cliente: "Ana", fecha: "2026-02-20" });

    expect(res.statusCode).toBe(201);
  });

  test('No permite reservas duplicadas', async () => {
    await request(app)
      .post('/reservas')
      .send({ cliente: "Luis", fecha: "2026-02-21" });

    const res = await request(app)
      .post('/reservas')
      .send({ cliente: "Carlos", fecha: "2026-02-21" });

    expect(res.statusCode).toBe(400);
  });

});
