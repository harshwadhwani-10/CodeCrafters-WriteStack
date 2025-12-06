import cloudinary from "../config/cloudinary.js"
import { handleError } from "../helpers/handleError.js"
import Blog from "../models/blog.model.js"
import { encode } from 'entities'
import Category from "../models/category.model.js"
export const addBlog = async (req, res, next) => {
    try {
        const data = JSON.parse(req.body.data)
        let featuredImage = ''
        if (req.file) {
            // Upload an image
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
        
        const blog = new Blog({
            author: data.author,
            category: data.category,
            title: data.title,
            slug: `${data.slug}-${Math.round(Math.random() * 100000)}`,
            featuredImage: featuredImage,
            blogContent: encode(data.blogContent),
        })

        await blog.save()

        res.status(200).json({
            success: true,
            message: 'Blog added successfully.'
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const editBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params
        const blog = await Blog.findById(blogid).populate('category', 'name')
        if (!blog) {
            next(handleError(404, 'Data not found.'))
        }
        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const updateBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params
        const data = JSON.parse(req.body.data)

        // PUT requires ALL fields to be provided
        if (!data.category || !data.title || !data.slug || !data.blogContent) {
            return next(handleError(400, 'All fields (category, title, slug, blogContent) are required for full update.'))
        }

        const blog = await Blog.findById(blogid)
        if (!blog) {
            return next(handleError(404, 'Blog not found.'))
        }

        // Overwrite all fields
        blog.category = data.category
        blog.title = data.title
        blog.slug = data.slug
        blog.blogContent = encode(data.blogContent)

        let featuredImage = blog.featuredImage

        if (req.file) {
            // Upload an image
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

        blog.featuredImage = featuredImage

        await blog.save()


        res.status(200).json({
            success: true,
            message: 'Blog updated successfully.'
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const patchUpdateBlog = async (req, res, next) => {
    try {
        console.log('PATCH route hit for blogid:', req.params.blogid)
        const { blogid } = req.params
        const data = JSON.parse(req.body.data)

        const blog = await Blog.findById(blogid)
        if (!blog) {
            return next(handleError(404, 'Blog not found.'))
        }

        // Only update fields that are present in the request
        if (data.category) {
            blog.category = data.category
        }
        if (data.title) {
            blog.title = data.title
        }
        if (data.slug) {
            blog.slug = data.slug
        }
        if (data.blogContent) {
            blog.blogContent = encode(data.blogContent)
        }

        // Handle image upload only if file is provided
        if (req.file) {
            try {
                const uploadResult = await cloudinary.uploader.upload(
                    req.file.path,
                    { 
                        folder: 'MERN-BLOG', 
                        resource_type: 'auto'
                    }
                );
                blog.featuredImage = uploadResult.secure_url;
            } catch (error) {
                console.error("Cloudinary upload error:", error);
                
                // Check for API secret mismatch
                if (error.message && error.message.includes('Invalid Signature')) {
                    return next(handleError(500, 'Cloudinary API secret mismatch. Please check your .env file.'));
                }
                
                return next(handleError(500, `Image upload failed: ${error.message}`));
            }
        }
        // If no file provided, keep the existing image (no change needed)

        await blog.save()

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully.',
            updatedFields: Object.keys(data)
        })

    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const deleteBlog = async (req, res, next) => {
    try {
        const { blogid } = req.params
        await Blog.findByIdAndDelete(blogid)
        res.status(200).json({
            success: true,
            message: 'Blog Deleted successfully.',
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const showAllBlog = async (req, res, next) => {
    try { 
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

        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getBlog = async (req, res, next) => {
    try {
        const { slug } = req.params
        const blog = await Blog.findOne({ slug })
            .populate('author', 'name avatar role')
            .populate('category', 'name slug')
            .lean()
            .exec()

        // If blog or author is missing, treat as not found
        if (!blog || !blog.author) {
            return next(handleError(404, 'Blog not found.'))
        }

        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getRelatedBlog = async (req, res, next) => {
    try {
        const { category, blog } = req.params

        const categoryData = await Category.findOne({ slug: category })
        if (!categoryData) {
            return next(404, 'Category data not found.')
        }
        const categoryId = categoryData._id
        const relatedBlog = await Blog.find({ category: categoryId, slug: { $ne: blog } }).lean().exec()
        res.status(200).json({
            relatedBlog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getBlogByCategory = async (req, res, next) => {
    try {
        const { category } = req.params

        const categoryData = await Category.findOne({ slug: category })
        if (!categoryData) {
            // return next(404, 'Category data not found.')
            return next(handleError(404, 'Category data not found.'));
        }
        const categoryId = categoryData._id
        let blog = await Blog.find({ category: categoryId })
            .populate('author', 'name avatar role')
            .populate('category', 'name slug')
            .lean()
            .exec()

        // Filter out blogs whose author no longer exists
        blog = blog.filter(b => b.author)
        res.status(200).json({
            blog,
            categoryData    
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
export const search = async (req, res, next) => {
    try {
        const { q } = req.query
        let blog = await Blog.find({ title: { $regex: q, $options: 'i' } })
            .populate('author', 'name avatar role')
            .populate('category', 'name slug')
            .lean()
            .exec()

        // Filter out blogs whose author no longer exists
        blog = blog.filter(b => b.author)
        res.status(200).json({
            blog,
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const getAllBlogs = async (req, res, next) => {
    try {
        const blogData = await Blog.find()
            .populate('author', 'name avatar role')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .lean()
            .exec()

        // Filter out blogs whose author no longer exists
        const blog = blogData.filter(b => b.author)

        res.status(200).json({
            blog
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}
