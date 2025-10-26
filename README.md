# 🚀 BlogHub - Modern MERN Stack Blogging Platform

<div align="center">

![BlogHub](https://img.shields.io/badge/BlogHub-MERN%20Blog-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A modern, feature-rich blogging platform built with the MERN stack**

[Features](#-features) •
[Tech Stack](#-tech-stack) •
[Installation](#-installation) •
[Environment Variables](#-environment-variables) •
[Usage](#-usage) •
[Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**BlogHub** is a comprehensive blogging platform that empowers users to create, share, and engage with blog content. Built with modern web technologies, it offers a seamless experience for both content creators and readers.

### Key Highlights

- 📝 **Rich Text Editing** - CKEditor 5 for professional content creation
- 👥 **User Authentication** - Secure JWT-based authentication with Google OAuth
- 🔔 **Real-time Notifications** - Stay updated with likes and comments
- 📊 **Admin Dashboard** - Comprehensive analytics and user management
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 💾 **Auto-save Drafts** - Never lose your content with automatic draft saving
- 📱 **Responsive Design** - Perfect experience across all devices

---

## ✨ Features

### 🔐 Authentication & User Management
- **JWT Authentication** - Secure token-based authentication
- **Google OAuth** - One-click social login
- **User Profiles** - Customizable user profiles with avatars
- **Password Reset** - Email-based password recovery
- **Role-based Access** - Admin and user role separation

### ✍️ Blog Management
- **Rich Text Editor** - Powerful CKEditor 5 with extensive formatting options
- **Auto-save Drafts** - Automatic saving prevents content loss
- **Image Upload** - Cloudinary integration for optimized image hosting
- **Category Organization** - Organize blogs into categories
- **Slug Generation** - SEO-friendly URLs
- **Featured Images** - Eye-catching blog covers

### 💬 Engagement Features
- **Like System** - Express appreciation for blogs
- **Comments** - Rich commenting system with replies
- **Real-time Notifications** - Instant updates on interactions
- **Comment Counts** - Track engagement metrics

### 🔍 Discovery
- **Advanced Search** - Find blogs instantly
- **Category Filtering** - Browse by topics
- **Related Blogs** - Discover similar content

### 👨‍💼 Admin Features
- **Dashboard Analytics** - Comprehensive statistics and insights
- **User Management** - Full user administration
- **Report Generation** - Download reports in PDF, Excel, and Word formats
- **Category Management** - Create and manage blog categories
- **Charts & Graphs** - Visual data representation
- **User Trend Analysis** - Track growth metrics

### 🎨 User Interface
- **Modern Design** - Clean and intuitive interface
- **Responsive Layout** - Mobile-first approach
- **Dark Mode Ready** - Easy theming support
- **Loading States** - Smooth user experience
- **Toast Notifications** - User-friendly feedback

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI Framework |
| **Vite** | 6.3.5 | Build Tool |
| **React Router** | 7.1.0 | Routing |
| **Redux Toolkit** | 2.5.0 | State Management |
| **CKEditor 5** | 44.1.0 | Rich Text Editor |
| **Tailwind CSS** | 3.4.17 | Styling |
| **Radix UI** | Latest | Component Library |
| **React Hook Form** | 7.54.2 | Form Management |
| **Zod** | 3.24.1 | Schema Validation |
| **Recharts** | 2.15.2 | Data Visualization |
| **React Toastify** | 11.0.2 | Notifications |
| **Date-fns** | 4.1.0 | Date Formatting |
| **Moment.js** | 2.30.1 | Date Utilities |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | Latest | Runtime Environment |
| **Express.js** | 4.21.2 | Web Framework |
| **MongoDB** | Latest | Database |
| **Mongoose** | 8.9.2 | ODM |
| **JWT** | 9.0.2 | Authentication |
| **Bcrypt** | 2.4.3 | Password Hashing |
| **Cloudinary** | 1.30.0 | Image Storage |
| **Multer** | 2.0.2 | File Upload |
| **Nodemailer** | 6.10.1 | Email Service |
| **PDFKit** | Latest | PDF Generation |
| **XLSX** | 0.18.5 | Excel Export |
| **Docx** | 9.3.0 | Word Export |

### Additional Tools
- **Firebase** - Google Authentication
- **Lodash** - Utility functions
- **Entities** - HTML entity decoding
- **Slugify** - URL slug generation
- **Cookie Parser** - Cookie management
- **CORS** - Cross-origin resource sharing

---

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn** package manager
- **Cloudinary** account (for image storage)
- **Google Cloud Console** project (for OAuth)
- **Email SMTP** credentials (for password reset)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/MERN_BLOG.git
cd MERN_BLOG
```

### 2. Install Dependencies

#### Install Backend Dependencies

```bash
cd api
npm install
```

#### Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## 🔧 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `api` directory:

```env
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGODB_CONN=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_APP_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Frontend Environment Variables

Create a `.env` file in the `client` directory:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5000/api

# Firebase Configuration (Optional, for Google OAuth)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

---

## 🎯 Usage

### 1. Start the Backend Server

```bash
cd api
npm run dev
```

The server will start on `http://localhost:5000`

### 2. Start the Frontend Development Server

```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production

#### Frontend Build

```bash
cd client
npm run build
```

#### Backend Production

```bash
cd api
npm start
```

---

## 📁 Project Structure

```
MERN_BLOG/
├── api/                          # Backend API
│   ├── config/                   # Configuration files
│   │   ├── cloudinary.js         # Cloudinary setup
│   │   └── multer.js             # File upload config
│   ├── controllers/              # Route controllers
│   │   ├── Admin.controller.js   # Admin operations
│   │   ├── Auth.controller.js    # Authentication
│   │   ├── Blog.controller.js    # Blog CRUD
│   │   ├── Category.controller.js
│   │   ├── Comment.controller.js
│   │   ├── Draft.controller.js
│   │   ├── Notification.controller.js
│   │   └── User.controller.js
│   ├── middleware/               # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── authenticate.js
│   │   ├── onlyadmin.js
│   │   └── upload.middleware.js
│   ├── models/                   # MongoDB models
│   │   ├── ban.model.js
│   │   ├── blog.model.js
│   │   ├── category.model.js
│   │   ├── comment.model.js
│   │   ├── draft.model.js
│   │   ├── like.model.js
│   │   ├── notification.model.js
│   │   ├── resetToken.model.js
│   │   └── user.model.js
│   ├── routes/                   # API routes
│   │   ├── Admin.route.js
│   │   ├── Auth.route.js
│   │   ├── Blog.route.js
│   │   ├── Category.route.js
│   │   ├── Comment.route.js
│   │   ├── Draft.route.js
│   │   ├── notification.routes.js
│   │   └── User.route.js
│   ├── helpers/                  # Helper functions
│   ├── utils/                    # Utility functions
│   │   └── email.js
│   └── index.js                  # Server entry point
│
├── client/                       # Frontend React App
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── assets/              # Images and static files
│   │   ├── components/           # React components
│   │   │   ├── ui/               # Reusable UI components
│   │   │   ├── AppSidebar.jsx
│   │   │   ├── AuthRouteProtechtion.jsx
│   │   │   ├── BlogCard.jsx
│   │   │   ├── Comment.jsx
│   │   │   ├── CommentList.jsx
│   │   │   ├── Editor.jsx
│   │   │   ├── NotificationDropdown.jsx
│   │   │   ├── Topbar.jsx
│   │   │   └── ...
│   │   ├── helpers/              # Helper functions
│   │   ├── hooks/                # Custom React hooks
│   │   ├── Layout/               # Layout components
│   │   ├── pages/                # Page components
│   │   │   ├── Admin/           # Admin pages
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── Blog/             # Blog pages
│   │   │   ├── Category/         # Category pages
│   │   │   ├── Index.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── SearchResult.jsx
│   │   │   └── ...
│   │   ├── redux/                # Redux store
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # App entry point
│   └── package.json
│
└── README.md                     # This file
```

---

## 🛣 API Endpoints

### Authentication Routes
```
POST   /api/auth/signup          # User registration
POST   /api/auth/signin          # User login
POST   /api/auth/logout          # User logout
POST   /api/auth/google           # Google OAuth
POST   /api/auth/forgot-password # Request password reset
POST   /api/auth/reset-password  # Reset password
```

### Blog Routes
```
GET    /api/blog                  # Get all blogs
GET    /api/blog/:id              # Get single blog
POST   /api/blog/add              # Create blog
PUT    /api/blog/update/:id       # Update blog
DELETE /api/blog/delete/:id       # Delete blog
```

### Category Routes
```
GET    /api/category/all-category # Get all categories
GET    /api/category/:id          # Get single category
POST   /api/category/add          # Create category (Admin only)
PUT    /api/category/update/:id   # Update category (Admin only)
DELETE /api/category/delete/:id   # Delete category (Admin only)
```

### Comment Routes
```
GET    /api/comment/get/:blogid   # Get comments for blog
POST   /api/comment/add            # Add comment
PUT    /api/comment/update/:id    # Update comment
DELETE /api/comment/delete/:id    # Delete comment
```

### Draft Routes
```
GET    /api/drafts                # Get user's draft
POST   /api/drafts                # Save draft
PUT    /api/drafts                # Update draft
DELETE /api/drafts                # Delete draft
```

### Notification Routes
```
GET    /api/notifications          # Get notifications
PUT    /api/notifications/:id     # Mark as read
DELETE /api/notifications/:id     # Delete notification
```

### Admin Routes
```
GET    /api/admin/dashboard                        # Get dashboard data
GET    /api/admin/download-report/:type/:format   # Download reports
GET    /api/admin/users                            # Get all users
PUT    /api/admin/ban-user/:id                     # Ban user
PUT    /api/admin/unban-user/:id                   # Unban user
```

---



## 🤝 Contributing

Contributions are always welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@Vitragshah2108](https://github.com/vitragshah2108)
- Email: vitragshah2108@gmail.com

---

## 🙏 Acknowledgments

- CKEditor team for the amazing rich text editor
- Tailwind CSS for the utility-first CSS framework
- All the open-source contributors
- MongoDB for the robust database solution
- Cloudinary for seamless image hosting

---

<div align="center">

**Made with ❤️ using the MERN Stack**

⭐ Star this repo if you found it helpful!

</div>

