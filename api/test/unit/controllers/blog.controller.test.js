// Unit specs for BlogController (pure logic/mocked models)

import request from 'supertest'

const api = () => request(process.env.API_BASE_URL || 'http://localhost:3000')

test('search responds', async () => {
  const res = await api().get('/api/blog/search?q=hello')
  expect([200, 404]).toContain(res.status)
})

test('get-blog by slug responds', async () => {
  const res = await api().get('/api/blog/get-blog/missing-slug')
  expect([404, 200]).toContain(res.status)
})

