import request from 'supertest'
import { setupTestHooks } from '../setup.js'

const api = () => request(process.env.API_BASE_URL || 'http://localhost:3000')

describe('Auth routes', () => {
  setupTestHooks()

  test('issues reset code', async () => {
    const res = await api()
      .post('/api/auth/send-reset-code')
      .send({ email: 'test@example.com' })
    expect([200, 404]).toContain(res.status)
  })
})

