import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoute from "./routes/user.route.js"
import GigRoute from "./routes/gig.route.js"
import AuthRoute from "./routes/auth.route.js"
import OrderRoute from "./routes/order.route.js"
import MessageRoute from "./routes/message.route.js"
import ReviewRoute from "./routes/review.route.js"
import ConversationRoute from "./routes/conversation.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

dotenv.config()
app.use(cors({ origin: "http://localhost:5173", credentials: true }))

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongodb")
    } catch (error) {
        throw error;
    }
}


mongoose.connection.on("disconnected", () => {
    console.log("mongodb disconnected")
})



app.listen("3000", (req, res) => {
    connect()
    console.log("server is running")
})

//middlewares

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", AuthRoute)
app.use("/api/users", userRoute)
app.use("/api/gigs", GigRoute)
app.use("/api/conversations", ConversationRoute)
app.use("/api/orders", OrderRoute)
app.use("/api/messages", MessageRoute)
app.use("/api/reviews", ReviewRoute)

app.use((err, req, res, next) => {
    const message = err.message || "Something went wrong"
    const status = err.status || 500
    return res.status(status).json({
        success: false,
        message: message,
        status: status,
        stack: err.stack
    })
})