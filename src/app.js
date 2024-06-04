import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express()
app.use(cors({  
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

// for data coming in the form of form data
app.use(express.json({limit: "15kb"}))
// for data coming from url 
app.use(express.urlencoded({extended:true, limit: "15kb"}))
//to store files by making public folder
app.use(express.static("public"))
app.use(cookieParser())


//routes

import userRouter from './routes/user.route.js'


//routes declaration
app.use("/api/v1/users", userRouter)
//http://localhost/api/v1/users/register
export {app}