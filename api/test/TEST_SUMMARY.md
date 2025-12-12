# WriteStack Test Suite Plan

This folder contains scaffolded Jest/Supertest tests for the core functionality of WriteStack. Each file outlines the critical behaviors to verify; fill in with your specific API base URL, test data, and factory utilities.

## How to run (suggested)
1. Use a dedicated test database (see `setup.js` for helper hooks).
2. Install dev deps: `npm i -D jest supertest mongodb-memory-server @types/jest` (adjust for your stack).
3. Point API calls to your local server (e.g., http://localhost:3000).
4. Seed minimal fixtures: users (admin + regular), categories, and a sample blog.

## Suites

- **integration/**
  - `auth.route.test.js`: register, login, logout, Google login flow, ban check, reset code.
  - `blog.route.test.js`: create/update/delete blog with image, get by slug, search, related, category filter, permissions (admin vs author).
  - `category.route.test.js`: add/update/delete/list categories (admin only), slug uniqueness.
  - `comment.route.test.js`: add/list/count/delete comments, permissions, validation.
  - `draft.route.test.js`: save/load/delete drafts, partial saves, image upload optional.
  - `notification.route.test.js`: list, mark read/all-read, permission to only read own notifications.

- **spec/**
  - `blog.spec.test.js`: happy-path blog lifecycle and edge cases (missing author, banned author filtered).
  - `notification.spec.test.js`: creation on like/comment, unread counts, cleanup when sender banned.
  - `validation.spec.test.js`: payload validation for auth, blog, comment, draft (e.g., missing title/category).

- **unit/controllers/**
  - `auth.controller.test.js`: register/login errors, banned user, reset OTP flow.
  - `blog.controller.test.js`: filtering orphaned authors, search, related blogs.
  - `user.controller.test.js`: ban/delete cascade (blogs, comments, likes, notifications).

- **unit/services/**
  - `email.service.test.js`: reset/password emails enqueue, failure handling (stub transport).
  - `cloudinary.service.test.js`: upload error handling, invalid signature path (stub uploader).

## Notes
- Prefer isolated tests with in-memory Mongo (mongodb-memory-server) or a disposable test DB.
- Mock external services (Cloudinary, Firebase, Judge0, Nodemailer) to keep tests deterministic.
- Use HTTP-only cookie handling in Supertest to simulate authenticated flows.

