import express from "express"
import { verifyToken } from "../utils/verification.js"
import { createNewGig, deleteGig, getGig, getGigs } from "../controller/gig.controller.js"

const router = express.Router()
//create anew gig
router.post("/", verifyToken, createNewGig)

//delete a gig
router.delete("/:gigId", verifyToken, deleteGig)

//get a single gig
router.get("/single/:gigId", getGig)

//get all gigs 
router.get("/", getGigs)


export default router
