# WriteStack – Code Refactoring Documentation

1. Centralized Error Handling (handleError Helper)

 Before

Error handling was inconsistent across controllers with different response formats:

```javascript
// In Blog.controller.js
if (!blog) {
    return res.status(404).json({
        message: 'Blog not found.'
    })
}

// In User.controller.js
if (!user) {
    return res.status(404).json({
        success: false,
        message: 'User not found.'
    })
}

// In Auth.controller.js
if (!user) {
    return res.status(404).json({
        error: 'User not found!'
    })
}
```

After

Centralized error helper ensures consistent error structure:

```javascript
// api/helpers/handleError.js
export const handleError = (statusCode, message) => {
    const error = new Error
    error.statusCode = statusCode
    error.message = message
    return error
}

// Used in controllers:
if (!blog) {
    return next(handleError(404, 'Blog not found.'))
}

// Global error middleware formats response:
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal server error.'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})
```

**Why this refactor matters:**
- Ensures consistent error response format across all endpoints
- Single source of truth for error handling
- Easier to update error format globally
- Follows DRY principle

---

2. User Banning with Comprehensive Data Cleanup

Before

User deletion only removed the user record, leaving orphaned data:

```javascript
export const deleteUser = async (req, res, next) => {
    const user = await User.findById(id);
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true });
}
```

After

Comprehensive cleanup removes all user-generated content:

```javascript
// api/controllers/User.controller.js
export const deleteUser = async (req, res, next) => {
    const user = await User.findById(id);
    
    // Create ban record
    const ban = new Ban({
        userId: user._id,
        name: user.name,
        email: user.email,
        reason: 'Account deleted by admin',
        bannedBy: req.user.id
    });
    await ban.save();

    // Delete all related data
    await Blog.deleteMany({ author: user._id });
    await Comment.deleteMany({ user: user._id });
    await Like.deleteMany({ user: user._id });
    await BlogLike.deleteMany({ user: user._id });
    await Notification.deleteMany({ 
        $or: [
            { sender: user._id },
            { recipient: user._id }
        ]
    });
    
    await User.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: 'User banned and data cleaned successfully'
    });
}
```

**Why this refactor matters:**
- Maintains data integrity by removing all user-related content
- Prevents orphaned blogs, comments, and likes
- Ensures like counts remain accurate
- Maintains audit trail with Ban model

---

3. Draft System Field Normalization

Before

Draft saving failed when empty strings were passed for ObjectId fields:

```javascript
export const saveDraft = async (req, res, next) => {
    const data = JSON.parse(req.body.data);
    
    if (draft) {
        draft.category = data.category || draft.category; // Empty string causes cast error
        draft.title = data.title || draft.title;
        await draft.save();
    }
}
```

After

Normalization converts empty strings to undefined for optional fields:

```javascript
// api/controllers/Draft.controller.js
export const saveDraft = async (req, res, next) => {
    const data = JSON.parse(req.body.data || '{}');

    // Normalize incoming data to avoid type cast errors
    const normalizedData = {
        category: data.category && data.category !== '' ? data.category : undefined,
        title: data.title || '',
        slug: data.slug || '',
        blogContent: data.blogContent || '',
    };
    
    if (draft) {
        // Only update fields that have values
        if (normalizedData.category) {
            draft.category = normalizedData.category;
        }
        if (normalizedData.title) {
            draft.title = normalizedData.title;
        }
        // ... other fields
        await draft.save();
    } else {
        // Create new draft - only set category if valid
        draft = new Draft({
            author: userId,
            ...(normalizedData.category && { category: normalizedData.category }),
            title: normalizedData.title,
            // ...
        });
        await draft.save();
    }
}
```

**Why this refactor matters:**
- Prevents MongoDB cast errors for ObjectId fields
- Allows partial saves during blog composition
- Handles empty form fields gracefully
- Enables auto-save to work even before category selection

---

4. Authentication Middleware Extraction

Before

JWT verification logic was duplicated in multiple routes:

```javascript
// In Blog.route.js
BlogRoute.post('/add', async (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) {
        return res.status(403).json({ message: 'Unauthorized' })
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decodeToken
    // ... blog creation logic
})

// In User.route.js
UserRoute.get('/profile', async (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) {
        return res.status(403).json({ message: 'Unauthorized' })
    }
    // ... same verification logic
})
```

After

Reusable authentication middleware:

```javascript
// api/middleware/authenticate.js
import jwt from 'jsonwebtoken'

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.access_token
        if (!token) {
            return next(403, 'Unauthorized')
        }
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodeToken
        next()
    } catch (error) {
        next(500, error.message)
    }
}

// Used in routes:
BlogRoute.post('/add', authenticate, upload.single('file'), addBlog)
UserRoute.get('/profile', authenticate, getUserProfile)
```

**Why this refactor matters:**
- Eliminates code duplication across routes
- Centralizes authentication logic
- Easy to update auth strategy in one place
- Follows Single Responsibility Principle

---

5. Blog Listing with Role-Based Filtering

Before

Role-based filtering logic was embedded in controller with potential security issues:

```javascript
export const showAllBlog = async (req, res, next) => {
    const user = req.user
    const blog = await Blog.find()
        .populate('author', 'name avatar role')
        .sort({ createdAt: -1 })
        .lean()
        .exec()
    
    // No filtering - all users see all blogs
    res.status(200).json({ blog })
}
```

After

Role-based query filtering ensures proper data access:

```javascript
// api/controllers/Blog.controller.js
export const showAllBlog = async (req, res, next) => {
    const user = req.user
    let blog;
    
    if (user.role === 'admin') {
        blog = await Blog.find()
            .populate('author', 'name avatar role')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .lean()
            .exec()
    } else {
        blog = await Blog.find({ author: user._id })
            .populate('author', 'name avatar role')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .lean()
            .exec()
    }

    // Filter out blogs whose author no longer exists
    blog = blog.filter(b => b.author)

    res.status(200).json({ blog })
}
```

**Why this refactor matters:**
- Enforces proper access control at data level
- Admins see all blogs, users see only their own
- Prevents unauthorized data access
- Maintains data privacy

---

6. Cloudinary Upload Error Handling

Before

Cloudinary upload errors were handled inconsistently:

```javascript
export const addBlog = async (req, res, next) => {
    if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path)
        featuredImage = uploadResult.secure_url;
    }
    // No error handling - crashes on upload failure
}
```

After

Centralized error handling with specific error messages:

```javascript
// api/controllers/Blog.controller.js
export const addBlog = async (req, res, next) => {
    let featuredImage = ''
    if (req.file) {
        try {
            const uploadResult = await cloudinary.uploader.upload(
                req.file.path,
                { 
                    folder: 'MERN-BLOG', 
                    resource_type: 'auto'
                }
            );
            featuredImage = uploadResult.secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            
            // Check for API secret mismatch
            if (error.message && error.message.includes('Invalid Signature')) {
                return next(handleError(500, 'Cloudinary API secret mismatch. Please check your .env file.'));
            }
            
            return next(handleError(500, `Image upload failed: ${error.message}`));
        }
    }
    // ... rest of blog creation
}
```

**Why this refactor matters:**
- Provides user-friendly error messages
- Handles specific error cases (API secret mismatch)
- Prevents application crashes on upload failures
- Consistent error handling across all upload endpoints

---

7. Like Cleanup for Both Models

Before

Only legacy Like model was cleaned up, leaving BlogLike entries:

```javascript
export const deleteUser = async (req, res, next) => {
    // ... other cleanup
    await Like.deleteMany({ user: user._id });
    // BlogLike entries remain, causing inaccurate like counts
    await User.findByIdAndDelete(id);
}
```

After

Comprehensive like cleanup for both models:

```javascript
// api/controllers/User.controller.js
export const deleteUser = async (req, res, next) => {
    // ... other cleanup
    
    console.log('Deleting legacy likes (if any)...');
    const likesResult = await Like.deleteMany({ user: user._id });
    console.log('Legacy likes deleted:', likesResult.deletedCount);

    console.log('Deleting blog likes...');
    const blogLikesResult = await BlogLike.deleteMany({ user: user._id });
    console.log('Blog likes deleted:', blogLikesResult.deletedCount);
    
    await User.findByIdAndDelete(id);
}
```

**Why this refactor matters:**
- Ensures accurate like counts after user deletion
- Removes all like-related data completely
- Prevents ghost likes from deleted users
- Maintains data consistency across both like models

---

8. Route Organization and RESTful Design

Before

Routes were mixed with business logic and inconsistent naming:

```javascript
// In index.js - all routes defined inline
app.post('/add-blog', authenticate, addBlog)
app.get('/get-blog/:id', getBlog)
app.put('/update-blog/:id', authenticate, updateBlog)
app.delete('/remove-blog/:id', authenticate, deleteBlog)
// Inconsistent naming, no grouping
```

After

Organized resource-based routes with RESTful conventions:

```javascript
// api/index.js
app.use('/api/auth', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/category', CategoryRoute)
app.use('/api/blog', BlogRoute)
app.use('/api/comment', CommentRoute)
app.use('/api/blog-like', BlogLikeRoute)
app.use('/api/notifications', notificationRoutes)
app.use('/api/drafts', DraftRoute)
app.use('/api/admin', AdminRoute)

// api/routes/Blog.route.js
BlogRoute.post('/add', authenticate, upload.single('file'), addBlog)
BlogRoute.get('/edit/:blogid', authenticate, editBlog)
BlogRoute.put('/update/:blogid', authenticate, upload.single('file'), updateBlog)
BlogRoute.patch('/patch-update/:blogid', authenticate, upload.single('file'), patchUpdateBlog)
BlogRoute.delete('/delete/:blogid', authenticate, deleteBlog)
BlogRoute.get('/get-all', authenticate, showAllBlog)
BlogRoute.get('/get-blog/:slug', getBlog)
BlogRoute.get('/blogs', getAllBlogs)
```

**Why this refactor matters:**
- Follows RESTful conventions for better API design
- Groups related endpoints logically
- Makes API more predictable and maintainable
- Separates route definitions from business logic
- Supports both PUT (full update) and PATCH (partial update)

---

## Summary

These refactors collectively improve code quality by:
- **Reducing duplication** through centralized helpers and middleware
- **Improving maintainability** with single points of change
- **Enhancing security** with proper access control and data filtering
- **Preventing errors** through defensive programming and validation
- **Following best practices** with RESTful design and consistent patterns

Each refactor addresses a specific pain point while maintaining backward compatibility and improving the overall developer experience.

