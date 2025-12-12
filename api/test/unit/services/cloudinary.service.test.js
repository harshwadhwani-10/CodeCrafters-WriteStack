// Unit specs for Cloudinary interactions

import cloudinary from '../../../config/cloudinary.js'

test('cloudinary is configured', () => {
  expect(typeof cloudinary.config).toBe('function')
})
