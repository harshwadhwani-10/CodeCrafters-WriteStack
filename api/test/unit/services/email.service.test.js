// Unit specs for email service (Nodemailer)

import { emailTemplates } from '../../../utils/email.js'

test('password reset template has subject and html', () => {
  const tpl = emailTemplates.passwordReset('N', 'http://x')
  expect(typeof tpl.subject).toBe('string')
  expect(typeof tpl.html).toBe('string')
})

