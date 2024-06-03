import { configDotenv } from 'dotenv';
import connectDB from './db/index.js';

configDotenv({path: './env'})


connectDB()






/*
import express from 'express'
const app = express()

//professionals use semi colon before starting iffi function
;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", ()=> {
            console.log("Error:", error)
            throw error
        })

        app.listen(process.env.PORT)
    } catch (error) {
        console.log("ERROR:" ,error)
        throw error
    }
})()
*/