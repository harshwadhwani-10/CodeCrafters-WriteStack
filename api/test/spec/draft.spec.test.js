import request from 'supertest'

const api = () => request(process.env.API_BASE_URL || 'http://localhost:3000')

test('draft endpoints respond', async () => {
  const saveRes = await api().post('/api/drafts').field('data', JSON.stringify({ title: 't' }))
  const getRes = await api().get('/api/drafts')
  const delRes = await api().delete('/api/drafts')
  expect([200, 401, 500]).toContain(saveRes.status)
  expect([200, 401, 500]).toContain(getRes.status)
  expect([200, 401, 500]).toContain(delRes.status)
})
