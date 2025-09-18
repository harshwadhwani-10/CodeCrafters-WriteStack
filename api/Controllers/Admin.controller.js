import { handleError } from "../helpers/handleError.js"
import User from "../models/user.model.js"
import Blog from "../models/blog.model.js"
import Category from "../models/category.model.js"
import { getDashboardStats, getBlogsByCategory, getUserRegistrationTrend } from "../services/analytics.service.js"
import { validateReportParams, getHeadersForType, formatRecordsForType, generateExcelBuffer, generateWordBuffer, generatePdfBuffer } from "../services/report.service.js"

export const getDashboardData = async (req, res, next) => {
    try {
        const [stats, categoryData, userTrendData] = await Promise.all([
            getDashboardStats(),
            getBlogsByCategory(),
            getUserRegistrationTrend()
        ])

        res.status(200).json({
            stats,
            categoryData,
            userTrendData
        })
    } catch (error) {
        next(handleError(500, error.message))
    }
}

export const downloadReport = async (req, res, next) => {
    try {
        const { type, format } = req.params

        try {
            validateReportParams(type, format)
        } catch (e) {
            return next(handleError(400, e.message))
        }

        // Get data based on type
        let data
        switch (type) {
            case 'category':
                data = await Category.find().lean()
                break
            case 'user':
                data = await User.find({ role: { $ne: 'admin' } })
                    .select('-password')
                    .lean()
                break
            case 'blog':
                data = await Blog.find()
                    .populate('author', 'name')
                    .populate('category', 'name')
                    .lean()
                break
        }

        const headers = getHeadersForType(type)
        const formattedData = formatRecordsForType(type, data)

        // Generate file based on format
        switch (format) {
            case 'excel': {
                const fileBuffer = generateExcelBuffer(formattedData)
                res.setHeader('Content-Type', 'application/vnd.ms-excel; charset=utf-8')
                res.setHeader('Content-Disposition', `attachment; filename=${type}-report.xls`)
                res.send(fileBuffer)
                return
            }
            case 'word': {
                const fileBuffer = await generateWordBuffer(type, headers, formattedData)
                res.setHeader('Content-Type', 'application/msword; charset=utf-8')
                res.setHeader('Content-Disposition', `attachment; filename=${type}-report.doc`)
                res.send(fileBuffer)
                return
            }
            case 'pdf': {
                const fileBuffer = await generatePdfBuffer(type, headers, formattedData)
                res.setHeader('Content-Type', 'application/pdf')
                res.setHeader('Content-Disposition', `attachment; filename=${type}-report.pdf`)
                res.send(fileBuffer)
                return
            }
        }
    } catch (error) {
        next(handleError(500, error.message))
    }
}