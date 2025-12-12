import request from 'supertest'
import { setupTestHooks } from '../setup.js'

const api = () => request(process.env.API_BASE_URL || 'http://localhost:3000')

describe('Comment routes', () => {
  setupTestHooks()

  test('gets comments for blog', async () => {
    const blogid = process.env.TEST_BLOG_ID || ''
    const res = await api().get(`/api/comment/get/${blogid}`)
    expect([200, 404]).toContain(res.status)
  })
})

