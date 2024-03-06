import Gig from "../models/gig.model.js"
import Order from "../models/order.model.js"
import { createError } from "../utils/createError.js"
import Stripe from "stripe"


export const intent = async (req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE)

    try {
        const gig = await Gig.findById(req.params.gigId)


        const getGig = await Gig.findById(req.params.gigId)
        if (getGig.userId === req.user.id) {
            return next(createError(400, "You cannot order the gig as you are yorself the seller"))
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: gig.price * 100 * 80,
            currency: "inr",
            payment_method_types: ['card'],
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.

        })

        const newOrder = new Order({
            gigId: getGig._id,
            title: getGig.title,
            sellerId: getGig.userId,
            buyerId: req.user.id,
            img: getGig.coverImg,
            price: getGig.price,
            payment_intent: paymentIntent.id
        })

        await newOrder.save()
        res.status(200).send({ clientSecret: paymentIntent.client_secret })

    } catch (err) {
        return next(err)
    }
}


export const updateOrder = async (req, res, next) => {
    try {
        await Order.findOneAndUpdate({ payment_intent: req.params.payment_intent }, { $set: { isCompleted: true } })
        res.status(200).json("Order updated")
    } catch (err) {
        next(err)
    }
}





export const createOrder = async (req, res, next) => {

    try {
        const getGig = await Gig.findById(req.params.gigId)
        if (getGig.userId === req.user.id) {
            return next(createError(400, "You cannot order the gig as you are yorself the seller"))
        }
        const newOrder = new Order({
            gigId: getGig._id,
            title: getGig.title,
            sellerId: getGig.userId,
            buyerId: req.user.id,
            img: getGig.coverImg,
            price: getGig.price,
            payment_intent: "ydxoyryidi"
        })

        await newOrder.save()
        res.status(200).json("Order created")
    } catch (err) {
        return next(err)
    }
}


export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find(req.user.isSeller ? { sellerId: req.user.id } : { buyerId: req.user.id, isCompleted: true })
        res.status(200).json(orders)
    } catch (err) {
        next(err)
    }
}