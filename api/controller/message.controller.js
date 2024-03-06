import Message from "../models/message.model.js"
import Conversation from "../models/conversation.model.js"

export const createMessage = async (req, res, next) => {
    const newMessage = new Message({
        conversationId: req.body.conversationId,
        userId: req.user.id,
        desc: req.body.desc
    })

    try {
        await newMessage.save()

        await Conversation.findOneAndUpdate({ id: req.body.conversationId }, {
            $set: {
                readBySeller: req.user.isSeller,
                readByBuyer: !req.user.isSeller,
                lastMessage: req.body.desc
            }
        })
        res.status(200).json("Message created")
    } catch (err) {
        next(err)
    }
}

export const getMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({ conversationId: req.params.conversationId })
        res.status(200).json(messages)
    } catch (err) {
        next(err)
    }
}