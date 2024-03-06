import Conversation from "../models/conversation.model.js"
import { createError } from "../utils/createError.js"

export const createConversation = async (req, res, next) => {

    const newConversation = new Conversation({
        //to here represents id of individual to whom conversation is made
        id: req.user.isSeller ? req.user.id + req.body.to : req.body.to + req.user.id,
        sellerId: req.user.isSeller ? req.user.id : req.body.to,
        buyerId: req.user.isSeller ? req.body.to : req.user.id,
        readBySeller: req.user.isSeller ? true : false,
        readByBuyer: req.user.isSeller ? false : true,
    })

    try {
        const created = await newConversation.save()
        res.status(200).json("created")
    } catch (err) {
        next(err)
    }
}

export const updateConversation = async (req, res, next) => {
    try {
        const conversation = await Conversation.findByIdAndUpdate(req.params.conversationId, { $set: { readByBuyer: true, readBySeller: true } }, { new: true })
        res.status(200).json(conversation)
    } catch (err) {
        next(err)
    }
}

export const getConversation = async (req, res, next) => {
    try {
        const conversation = await Conversation.findOne({ id: req.params.conversationId })
        if (!conversation) {
            return next(createError(402, "Converation doesnt exist"))
        }
        res.status(200).json(conversation)
    } catch (err) {
        next(err)
    }
}

export const getAllConversations = async (req, res, next) => {
    try {
        const allConversations = await Conversation.find(req.user.isSeller ? { sellerId: req.user.id } : { buyerId: req.user.id }).sort({ updatedAt: -1 })
        res.status(200).json(allConversations)
    } catch (err) {
        next(err)
    }
}