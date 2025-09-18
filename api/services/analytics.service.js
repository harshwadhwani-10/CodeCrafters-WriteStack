import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import Category from "../models/category.model.js";
import Like from "../models/like.model.js";

export const getDashboardStats = async () => {
	const [totalBlogs, totalUsers, totalCategories, totalLikes] = await Promise.all([
		Blog.countDocuments(),
		User.countDocuments({ role: { $ne: 'admin' } }),
		Category.countDocuments(),
		Like.countDocuments()
	]);

	return { totalBlogs, totalUsers, totalCategories, totalLikes };
};

export const getBlogsByCategory = async () => {
	const categoryData = await Blog.aggregate([
		{ $group: { _id: '$category', count: { $sum: 1 } } },
		{ $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
		{ $unwind: '$category' },
		{ $project: { name: '$category.name', count: 1, _id: 0 } }
	]);
	return categoryData;
};

export const getUserRegistrationTrend = async () => {
	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

	const userTrendData = await User.aggregate([
		{ $match: { createdAt: { $gte: sixMonthsAgo }, role: { $ne: 'admin' } } },
		{ $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
		{ $project: { month: '$_id', count: 1, _id: 0 } },
		{ $sort: { month: 1 } }
	]);
	return userTrendData;
};


