// Unit specs for UserController (ban/delete cleanup)

import { deleteUser } from '../../../controllers/User.controller.js'
import { jest } from '@jest/globals'

jest.mock('../../../models/user.model.js', () => ({ __esModule: true, default: { findById: jest.fn(async () => ({ _id: 'u1', email: '202412100@daiict.ac.in', name: 'Admin' })), findByIdAndDelete: jest.fn(async () => {}) } }))
jest.mock('../../../utils/email.js', () => ({ __esModule: true, sendEmail: jest.fn(async () => ({})), emailTemplates: { accountDeletion: { subject: 's', text: 't', html: 'h' } } }))

test('prevents deleting admin account', async () => {
  const req = { params: { id: 'u1' }, user: { id: 'admin' } }
  const res = { status: jest.fn(() => res), json: jest.fn() }
  const next = jest.fn()
  await deleteUser(req, res, next)
  expect(next).toHaveBeenCalled()
})
