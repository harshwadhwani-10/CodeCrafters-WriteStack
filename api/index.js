import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import AuthRoute from './routes/Auth.route.js'
import UserRoute from './routes/User.route.js'
import CategoryRoute from './routes/Category.route.js'
import BlogRoute from './routes/Blog.route.js'
import CommentRouote from './routes/Comment.route.js'
import BlogLikeRoute from './routes/Bloglike.route.js'
import notificationRoutes from './routes/notification.routes.js'
import DraftRoute from './routes/Draft.route.js'
import AdminRoute from './routes/Admin.route.js'
import morgan from 'morgan'

dotenv.config()

const PORT = process.env.PORT
const app = express()

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

// Serve static SSR pages (About, Contact, etc.) under /api/static
app.use('/api/static', express.static(path.join(__dirname, 'public')))

// Explicit routes for static pages to avoid any edge-case resolution issues
app.get('/api/static/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'))
})

app.get('/api/static/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'))
})

app.use(morgan("tiny"));
// route setup      

app.use('/api/auth', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/category', CategoryRoute)
app.use('/api/blog', BlogRoute)
app.use('/api/comment', CommentRouote)
app.use('/api/blog-like', BlogLikeRoute)
app.use('/api/notifications', notificationRoutes)
app.use('/api/drafts', DraftRoute)
app.use('/api/admin', AdminRoute)



if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_CONN, { dbName: 'yt-mern-blog' })
    .then(() => console.log('Database connected.'))
    .catch(err => console.log('Database connection failed.', err));

  app.listen(PORT, () => console.log('Server running on port', PORT));
}


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server error.'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})
export default app;
