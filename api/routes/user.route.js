import express from "express"
import { verifyToken, verifyUser } from "../utils/verification.js"
import { becomeSeller, deleteUser, getUser } from "../controller/user.controller.js"

const router = express.Router()

//get a user from users collection by ID
router.get("/:userID", getUser)

router.delete("/:userId", verifyUser, deleteUser)

//update the user from buyer to seller
router.put("/", verifyToken, becomeSeller)
export default router
