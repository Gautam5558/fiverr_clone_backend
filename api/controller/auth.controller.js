import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { createError } from "../utils/createError.js";
import jwt from "jsonwebtoken"

export const register = async (req, res, next) => {


    try {
        const user = await User.findOne({ username: req.body.username })
        if (user) {
            return next(createError(500, "Username already exists"))
        }
        try {
            const userChechEmail = await User.findOne({ email: req.body.email })
            if (userChechEmail) {
                return next(createError(500, "Email already exists"))
            }
        } catch (err) {
            return next(err)
        }

    } catch (err) {
        return next(err)
    }


    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    try {
        const newUser = new User({
            ...req.body,
            password: hash,
        })

        await newUser.save()
        res.status(200).json("User has been created")

    } catch (err) {
        next(err)
    }
}


export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        if (!user) {
            return next(createError(500, "This username doesn't exist"))
        }

        const value = bcrypt.compareSync(req.body.password, user.password);
        if (!value) {
            return next(createError(500, "Password doesn't match to username"))
        }

        const token = jwt.sign({ id: user._id, isSeller: user.isSeller }, process.env.JWT_KEY)
        const { password, ...otherProperties } = user._doc
        res.cookie("access_token", token, {
            httpOnly: true, path: "/",
        }).status(200).json(otherProperties)

    } catch (err) {
        next(err)
    }
}


export const logout = (req, res, next) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out")
}