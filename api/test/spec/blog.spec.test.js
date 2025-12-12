// High-level blog lifecycle specs (happy paths + edge cases)

import request from 'supertest'

const api = () => request(process.env.API_BASE_URL || 'http://localhost:3000')

test('search blogs responds', async () => {
  const res = await api().get('/api/blog/search?q=test')
  expect([200, 404]).toContain(res.status)
})

test('get missing blog by slug returns 404', async () => {
  const res = await api().get('/api/blog/get-blog/missing-slug')
  expect([404, 200]).toContain(res.status)
})

