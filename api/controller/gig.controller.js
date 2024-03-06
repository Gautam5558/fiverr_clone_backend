import Gig from "../models/gig.model.js"
import { createError } from "../utils/createError.js"

export const createNewGig = async (req, res, next) => {
    if (req.user.isSeller !== true) {
        return next(createError(400, "You're not a seller"))
    }
    const newGig = new Gig({
        ...req.body,
        userId: req.user.id
    })
    try {
        await newGig.save()
        res.status(200).json("Gig created")
    } catch (err) {
        next(err)
    }
}

export const deleteGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.gigId)
        if (gig.userId != req.user.id) {
            return next(createError(400, "You are not authorized"))
        }

        try {
            await Gig.deleteOne({ _id: req.params.gigId })
            res.status(200).json("Gig has been deleted")
        } catch (err) {
            next(err)
        }

    } catch (err) {
        next(err)
    }
}

export const getGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.gigId)
        res.status(200).json(gig)
    } catch (err) {
        next(err)
    }
}


export const getGigs = async (req, res, next) => {
    const { cat, min, max, search, userId, sort } = req.query
    const filters = {
        ...(userId && { userId: userId }),
        ...(cat && { cat: cat }),
        ...((parseInt(min) || parseInt(max)) && {
            price: {
                ...(parseInt(min) && { $gt: parseInt(min) }),
                ...(parseInt(max) && { $lt: parseInt(max) }),
            }
        }),
        ...(search && { title: { $regex: search, $options: "i" } })
    }
    try {
        const gigs = await Gig.find(filters).sort({ [sort]: -1 })
        res.status(200).json(gigs)
    } catch (err) {
        next(err)
    }
}