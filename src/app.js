import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// for data coming in the form of form data
app.use(express.json({ limit: "15kb" }))
// for data coming from url 
app.use(express.urlencoded({ extended: true, limit: "15kb" }))
//to store files by making public folder
app.use(express.static("public"))
app.use(cookieParser())


//routes

import userRouter from './routes/user.route.js'
import tweetRouter from './routes/tweet.route.js'
import likeRouter from './routes/like.route.js'
import videoRouter from './routes/video.route.js'
import commentRouter from './routes/comment.route.js'
import playlistRouter from './routes/playlist.route.js'
import subscriptionRouter from './routes/subscription.route.js'

//for swagger
import swagger from "../swagger.js"

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/subscription", subscriptionRouter)
app.use("/api/v1/api-docs", swagger)
//http://localhost/api/v1/users/register
export { app }