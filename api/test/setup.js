// test/setup.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../index.js'; // path to exported app

dotenv.config();

process.env.API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'

const connectTestDb = async () => {
  const uri = process.env.MONGODB_CONN_TEST || process.env.MONGODB_CONN;
  if (!uri) throw new Error("Missing MONGODB_CONN_TEST env");
  await mongoose.connect(uri, { dbName: 'yt-mern-blog-test' });
};

const disconnectTestDb = async () => {
  await mongoose.connection.close();
};

export const setupTestHooks = () => {
  beforeAll(async () => await connectTestDb());
  afterAll(async () => await disconnectTestDb());
};

export default app;
