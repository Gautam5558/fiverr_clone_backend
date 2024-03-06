import express from "express"
import { verifyToken } from "../utils/verification.js"
import { createMessage, getMessages } from "../controller/message.controller.js"

const router = express.Router()

//create message
router.post("/", verifyToken, createMessage)

//get all messages of a conversation
router.get("/:conversationId", verifyToken, getMessages)

export default router
