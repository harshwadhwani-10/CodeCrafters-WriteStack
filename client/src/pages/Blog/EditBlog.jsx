import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import slugify from 'slugify'
import { showToast } from '@/helpers/showToast'
import { getEvn } from '@/helpers/getEnv'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useFetch } from '@/hooks/useFetch'
import Dropzone from 'react-dropzone'
import Editor from '@/components/Editor'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { RouteBlog } from '@/helpers/RouteName'
import { decode } from 'entities'
import Loading from '@/components/Loading'
const EditBlog = () => {
    const { blogid } = useParams()
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const { data: categoryData } = useFetch(`${getEvn('VITE_API_BASE_URL')}/category/all-category`, {
        method: 'get',
        credentials: 'include'
    })

    const { data: blogData, loading: blogLoading } = useFetch(`${getEvn('VITE_API_BASE_URL')}/blog/edit/${blogid}`, {
        method: 'get',
        credentials: 'include'
    }, [blogid])

 

    const [filePreview, setPreview] = useState()
    const [file, setFile] = useState()
    const [originalData, setOriginalData] = useState(null)
    const [originalImageUrl, setOriginalImageUrl] = useState(null)

    const formSchema = z.object({
        category: z.string().min(3, 'Category must be at least 3 character long.'),
        title: z.string().min(3, 'Title must be at least 3 character long.'),
        slug: z.string().min(3, 'Slug must be at least 3 character long.'),
        blogContent: z.string().min(3, 'Blog content must be at least 3 character long.'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: '',
            title: '',
            slug: '',
            blogContent: '',
        },
    })

    useEffect(() => {
        if (blogData) {
            const decodedContent = decode(blogData.blog.blogContent)
            setPreview(blogData.blog.featuredImage)
            setOriginalImageUrl(blogData.blog.featuredImage)
            form.setValue('category', blogData.blog.category._id)
            form.setValue('title', blogData.blog.title)
            form.setValue('slug', blogData.blog.slug)
            form.setValue('blogContent', decodedContent)
            
            // Store original data for comparison
            setOriginalData({
                category: blogData.blog.category._id,
                title: blogData.blog.title,
                slug: blogData.blog.slug,
                blogContent: decodedContent,
                featuredImage: blogData.blog.featuredImage
            })
        }
    }, [blogData])



    const handleEditorData = (event, editor) => {
        const data = editor.getData()
        form.setValue('blogContent', data)
    }


    const blogTitle = form.watch('title')

    useEffect(() => {
        if (blogTitle) {
            const slug = slugify(blogTitle, { lower: true })
            form.setValue('slug', slug)
        }
    }, [blogTitle])

    async function onSubmit(values) {
        try {
            if (!originalData) {
                return showToast('error', 'Original data not loaded. Please wait.')
            }

            // Detect changed fields
            const changedFields = {}
            const TOTAL_FIELDS = 5 // category, title, slug, blogContent, featuredImage

            if (values.category !== originalData.category) {
                changedFields.category = values.category
            }
            if (values.title !== originalData.title) {
                changedFields.title = values.title
            }
            if (values.slug !== originalData.slug) {
                changedFields.slug = values.slug
            }
            if (values.blogContent !== originalData.blogContent) {
                changedFields.blogContent = values.blogContent
            }

            // Check if image changed
            const fileChanged = file !== undefined && file !== null
            if (fileChanged) {
                changedFields.featuredImage = true
            }

            // Determine if all fields changed
            const allFieldsChanged = Object.keys(changedFields).length === TOTAL_FIELDS

            const formData = new FormData()

            if (allFieldsChanged) {
                // PUT: Send all fields
                if (file) {
                    formData.append('file', file)
                }
                formData.append('data', JSON.stringify(values))

                const response = await fetch(`${getEvn('VITE_API_BASE_URL')}/blog/update/${blogid}`, {
                    method: 'PUT',
                    credentials: 'include',
                    body: formData
                })
                const data = await response.json()
                if (!response.ok) {
                    return showToast('error', data.message)
                }
                form.reset()
                setFile()
                setPreview()
                navigate(RouteBlog)
                showToast('success', data.message)
            } else {
                // PATCH: Send only changed fields
                formData.append('data', JSON.stringify(changedFields))
                if (fileChanged) {
                    formData.append('file', file)
                }

                const response = await fetch(`${getEvn('VITE_API_BASE_URL')}/blog/patch-update/${blogid}`, {
                    method: 'PATCH',
                    credentials: 'include',
                    body: formData
                })
                const data = await response.json()
                if (!response.ok) {
                    return showToast('error', data.message)
                }
                form.reset()
                setFile()
                setPreview()
                navigate(RouteBlog)
                showToast('success', data.message)
            }
        } catch (error) {
            showToast('error', error.message)
        }
    }

    const handleFileSelection = (files) => {
        const file = files[0]
        const preview = URL.createObjectURL(file)
        setFile(file)
        setPreview(preview)
    }

    if (blogLoading) return <Loading />
    return (
        <div>
            <Card className="pt-5">
                <CardContent>
                    <h1 className='text-2xl font-bold mb-4'>Edit Blog</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}  >
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (

                                        <FormItem>

                                            <FormLabel>Category</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger  >
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categoryData && categoryData.category.length > 0 &&
                                                            categoryData.category.map(category => <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>)
                                                        }


                                                    </SelectContent>
                                                </Select>

                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter blog title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Slug" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-3'>
                                <span className='mb-2 block'>Featured Image</span>
                                <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                                    {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <div className='flex justify-center items-center w-36 h-28 border-2 border-dashed rounded'>
                                                <img src={filePreview} />
                                            </div>
                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                            <div className='mb-3'>

                                <FormField
                                    control={form.control}
                                    name="blogContent"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Blog Content</FormLabel>
                                            <FormControl>
                                                <Editor props={{ initialData: field.value, onChange: handleEditorData }} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>



                            <Button type="submit" className="w-full">Submit</Button>
                        </form>
                    </Form>

                </CardContent>
            </Card>

        </div>
    )
}

export default EditBlog