import jwt from 'jsonwebtoken'
import { handleError } from "../helpers/handleError.js"

export const onlyadmin = async (req, res, next) => {
    console.log("onlyadmin");
    try {
        const token = req.cookies.access_token
        if (!token) {
            console.log("no token");
            return next(handleError(403, 'Unauthorized'))
        }
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET)
        if (decodeToken.role === 'admin') {
            req.user = decodeToken
            next()
        } else {
            return next(handleError(403, 'Unauthorized'))
        }
    } catch (error) {
        next(handleError(500, error.message))
    }
}