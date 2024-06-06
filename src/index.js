import { configDotenv } from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

configDotenv({path: './.env'})


connectDB()
.then( () => {
    app.on( "error",(error)=> {
        console.log("ERROR : ", error);
        throw error;
    })
    app.listen(process.env.PORT || 4000, ()=> {
        console.log(`Server is running at http://localhost:${process.env.PORT || 4000 }`);
    })
})
.catch( (error)=> {
    console.log("Mongo Db connection failed :", error);
})

app.get("/", (req, res) => {
    res.send("<h1> Finally Server is running</h1>")
})





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