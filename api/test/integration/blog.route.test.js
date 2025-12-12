import request from 'supertest'
import { setupTestHooks } from '../setup.js'

const api = () => request(process.env.API_BASE_URL || 'http://localhost:3000')

describe('Blog routes', () => {
  setupTestHooks()

  test('gets blog by slug', async () => {
    const slug = process.env.TEST_BLOG_SLUG || 'sample-slug'
    const res = await api().get(`/api/blog/get-blog/${slug}`)
    expect([200, 404]).toContain(res.status)
  })

  test('searches blogs', async () => {
    const res = await api().get('/api/blog/search?q=test')
    expect(res.status).toBe(200)
  })
})

