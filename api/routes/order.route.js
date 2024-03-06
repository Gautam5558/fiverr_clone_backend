import express from "express"
import { verifyToken } from "../utils/verification.js"
import { createOrder, getOrders, intent, updateOrder } from "../controller/order.controller.js"

const router = express.Router()

//create an order (we can do it by both get or post requests)
router.get("/:gigId", verifyToken, createOrder)

//get orders either buyer or seller
router.get("/", verifyToken, getOrders)

//payment route
router.post("/create-payment-intent/:gigId", verifyToken, intent)

//order update after payment completion
router.put("/:payment_intent", updateOrder)


export default router
