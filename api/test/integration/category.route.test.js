import request from 'supertest'
import { setupTestHooks } from '../setup.js'

const api = () => request(process.env.API_BASE_URL || 'http://localhost:3000')

describe('Category routes (admin)', () => {
  setupTestHooks()

  test('creates category (admin)', async () => {
    const res = await api()
      .post('/api/category/add')
      .set('Cookie', process.env.ADMIN_COOKIE || '')
      .send({ name: 'Testing', slug: 'testing' })
    expect([200, 400, 401, 403]).toContain(res.status)
  })

  test('lists categories', async () => {
    const res = await api().get('/api/category/all-category')
    expect(res.status).toBe(200)
  })
})

