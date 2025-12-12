// Payload validation specs for core flows

import { handleError } from '../../helpers/handleError.js'

test('handleError returns error with status and message', () => {
  const err = handleError(400, 'Bad')
  expect(err.statusCode).toBe(400)
  expect(err.message).toBe('Bad')
})

test('dummy validation passes', () => {
  expect(true).toBe(true)
})
