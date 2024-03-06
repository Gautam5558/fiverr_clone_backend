import express from "express"
import { verifyToken } from "../utils/verification.js"
import { createConversation, getAllConversations, getConversation, updateConversation } from "../controller/conversation.controller.js"

const router = express.Router()
//creating conversation either by seller or buyer
router.post("/", verifyToken, createConversation)

//updating conversation
router.put("/:conversationId", verifyToken, updateConversation)

//get conversation
router.get("/single/:conversationId", verifyToken, getConversation)

//get all conversations
router.get("/", verifyToken, getAllConversations)

export default router
