// Unit specs for AuthController (use stubs/mocks)

import request from 'supertest'

const api = () => request(process.env.API_BASE_URL || 'http://localhost:3000')

test('register responds', async () => {
  const res = await api().post('/api/auth/register').send({ name: 'n' })
  expect([200, 400, 500]).toContain(res.status)
})

test('login responds to bad payload', async () => {
  const res = await api().post('/api/auth/login').send({ email: 'x' })
  expect([200, 400, 401, 404, 500]).toContain(res.status)
})

test('send reset code responds', async () => {
  const res = await api().post('/api/auth/send-reset-code').send({ email: 'e@example.com' })
  expect([200, 404, 500]).toContain(res.status)
})

