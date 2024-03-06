import { createError } from "../utils/createError.js"
import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) {
        return next(createError(400, "You're not logged in"))
    }

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) {
            return next(err)
        }
        req.user = user
        next()
    })

}


export const verifyUser = (req, res, next) => {

    verifyToken(req, res, () => {
        if (req.user.id !== req.params.userId) {
            return next(createError(400, "You are not authorized"))
        }

        next()
    })

}