import express from "express"
import { verifyToken } from "../utils/verification.js"
import { createReview, getReviewsByGigId } from "../controller/review.controller.js"

const router = express.Router()

router.post("/", verifyToken, createReview)

router.get("/:gigId", getReviewsByGigId)

export default router
