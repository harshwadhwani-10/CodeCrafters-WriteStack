import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const Index = () => {
    const location = useLocation()
    const [staticHtml, setStaticHtml] = useState('')
    const [staticLoading, setStaticLoading] = useState(false)
    const [staticError, setStaticError] = useState(null)

    const searchParams = new URLSearchParams(location.search)
    const page = searchParams.get('page')

    const { data: blogData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/blogs`, {
        method: 'get',
        credentials: 'include'
    })

    useEffect(() => {
        // When page is about/contact, fetch SSR HTML from backend static
        if (page === 'about' || page === 'contact') {
            const filename = page === 'about' ? 'about.html' : 'contact.html'
            const url = `${getEnv('VITE_API_BASE_URL')}/static/${filename}`

            setStaticLoading(true)
            setStaticError(null)
            fetch(url, { credentials: 'include' })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Failed to load page (status ${res.status})`)
                    }
                    return res.text()
                })
                .then((html) => {
                    setStaticHtml(html)
                })
                .catch((err) => {
                    setStaticError(err.message)
                })
                .finally(() => {
                    setStaticLoading(false)
                })
        } else {
            // Reset when not on static page
            setStaticHtml('')
            setStaticError(null)
            setStaticLoading(false)
        }
    }, [page])

    // When viewing SSR About / Contact, render that instead of blog list
    if (page === 'about' || page === 'contact') {
        if (staticLoading) {
            return <Loading />
        }

        if (staticError) {
            return <div className="p-4 text-center text-red-600">{staticError}</div>
        }

        return (
            <div
                className="w-full"
                // SSR HTML from backend
                dangerouslySetInnerHTML={{ __html: staticHtml }}
            />
        )
    }

    // Default: existing blog list behaviour
    if (loading) return <Loading />
    return (
        <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10'>
            {blogData && blogData.blog.length > 0
                ?
                blogData.blog.map(blog => <BlogCard key={blog._id} props={blog} />)
                :
                <div>Data Not Found.</div>
            }
        </div>
    )
}

export default Index