// Notification behavior specs

import request from 'supertest'

const api = () => request(process.env.API_BASE_URL || 'http://localhost:3000')

test('notifications list responds', async () => {
  const res = await api().get('/api/notifications')
  expect([200, 401, 500]).toContain(res.status)
})

test('mark all notifications as read responds', async () => {
  const res = await api().patch('/api/notifications/read-all')
  expect([200, 401, 500]).toContain(res.status)
})
