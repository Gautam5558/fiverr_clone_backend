import Review from "../models/review.model.js"
import Gig from "../models/gig.model.js"
import { createError } from "../utils/createError.js"

export const createReview = async (req, res, next) => {
    if (req.user.isSeller === true) {
        return next(createError(400, "You are not allowed as you are a seller"))
    }
    const newReview = new Review({
        ...req.body,
        userId: req.user.id,
        gigId: req.body.gigId,
    })
    try {
        const oldReview = await Review.findOne({ userId: req.user.id, gigId: req.body.gigId })
        if (oldReview) {
            return next(createError(400, "You have already reviewed on this gig"))
        }

        await newReview.save()

        await Gig.findByIdAndUpdate(req.body.gigId, { $inc: { totalStars: req.body.star, starNumber: 1 } })
        res.status(200).json("Review Created")
    } catch (err) {
        next(err)
    }

}


export const getReviewsByGigId = async (req, res, next) => {
    try {
        const reviews = await Review.find({ gigId: req.params.gigId })
        res.status(200).json(reviews)
    } catch (err) {
        next(err)
    }
}

